import Vue from 'vue';
import gql from 'graphql-tag';
import { apolloClient, resetApolloCache } from '@/apollo';
import { request, requestJson } from '@/utilities';

const SET_JWT = 'SET_JWT';
const CLEAR_JWT = 'CLEAR_JWT';

const SET = 'SET';

const ADD_INSTRUMENT_TO_WATCHLIST = 'ADD_INSTRUMENT_TO_WATCHLIST';
const REMOVE_INSTRUMENT_FROM_WATCHLIST = 'REMOVE_INSTRUMENT_FROM_WATCHLIST';

const cache = {
  user: null,
  groups: null,
  watchlists: null,
  markets: null,
  instruments: null
};

export default {
  state: {
    jwt: null,
    user: {
      uuid: null,
      firstName: null,
      lastName: null,
      email: null
    },
    groups: null,
    watchlists: null,
    markets: null,
    instruments: null
  },
  getters: {
    getMarketByMic(state) {
      return mic => Object.values(state.markets || {})
        .find(market => market.mic === mic);
    },
    getInstrumentByMicAndSymbol(state) {
      return (mic, symbol) => Object.values(state.instruments || {})
        .find(instrument => instrument.symbol === symbol 
          && (state.markets[instrument.market_uuid] || {}).mic === mic);
    }
  },
  mutations: {
    [SET_JWT](state, { token }) {
      state.jwt = token;
      const claims = JSON.parse(atob(token.split('.')[1]));
      state.user.uuid = claims.sub;
      state.user.firstName = claims.given_name;
      state.user.lastName = claims.family_name;
      state.user.email = claims.email;
      localStorage.setItem('jwt', token);
    },
    [CLEAR_JWT](state) {
      state.jwt = null;
      state.user.uuid = null;
      state.user.firstName = null;
      state.user.lastName = null;
      state.user.email = null;
      state.groups = null;
      state.watchlists = null;
      localStorage.removeItem('jwt');
    },
    [SET](state, { object, key, value }) {
      const _object = typeof object === 'function' ? object(state) : object || state;
      const _key = typeof key === 'function' ? key(state) : key;
      const _value = typeof value === 'function' ? value(state) : value;
      Vue.set(_object, _key, _value);
    },
    [ADD_INSTRUMENT_TO_WATCHLIST](state, { instrument_uuid, watchlist_uuid }) {
      Vue.set(state.watchlists[watchlist_uuid].instruments, instrument_uuid, state.instruments[instrument_uuid]);
    },
    [REMOVE_INSTRUMENT_FROM_WATCHLIST](state, { instrument_uuid, watchlist_uuid }) {
      Vue.delete(state.watchlists[watchlist_uuid].instruments, instrument_uuid);
    }
  },
  actions: {
    async load({ state, commit, dispatch }, dependencies) {
      // TODO: create a dependecy tree object that can be referred when loading data

      if (dependencies.hasOwnProperty('instruments')) {
        if (!cache.instruments)
          cache.instruments = requestJson('GET', 
            `https://api.projectfina.com/v01/instruments/`)
            .then(({ instruments }) => commit(SET, { 
              key: 'instruments', 
              value: instruments 
            }));
        await cache.instruments;

        for (const instrument_uuid in dependencies.instruments || {}) {
          const instrument = state.instruments[instrument_uuid];
          if ((dependencies.instruments[instrument_uuid] || {}).hasOwnProperty('quotes')) {
            if (!cache.instruments[instrument_uuid])
              cache.instruments[instrument_uuid] = {};

            if ((dependencies.instruments[instrument_uuid].quotes || {}).hasOwnProperty('current'))
              await dispatch('load', { markets: { [instrument.market_uuid]: { quotesUpdated: null } } });

            if ((dependencies.instruments[instrument_uuid].quotes || {}).hasOwnProperty('eod')) {
              if (!cache.instruments[instrument_uuid].quotes)
                cache.instruments[instrument_uuid].quotes = {};
              if (!cache.instruments[instrument_uuid].quotes.eod)
                cache.instruments[instrument_uuid].quotes.eod = {};

              for (const year in dependencies.instruments[instrument_uuid].quotes.eod || {}) {
                if (!cache.instruments[instrument_uuid].quotes.eod[year]) {
                  const mic = state.markets[instrument.market_uuid].mic;
                  const symbol = instrument.symbol;
                  cache.instruments[instrument_uuid].quotes.eod[year] = requestJson('GET', 
                    `https://api.projectfina.com/v01/eod/${year}/${mic}/${symbol[0]}/_${symbol}.json`)
                    .then(quotes => commit(SET, !instrument.quotes 
                        ? {
                          object: state => state.instruments[instrument_uuid],
                          key: 'quotes',
                          value: { 'eod': { [year]: quotes } }
                        }
                        : !instrument.quotes.eod
                          ? {
                            object: state => state.instruments[instrument_uuid].quotes,
                            key: 'eod',
                            value: { [year]: quotes }
                          }
                          : {
                            object: state => state.instruments[instrument_uuid].quotes.eod,
                            key: year,
                            value: quotes
                          }));
                }
                await cache.instruments[instrument_uuid].quotes.eod[year];
              }
            }
          }
        }
      }

      if (dependencies.hasOwnProperty('markets')) {
        await dispatch('load', { instruments: null });
        if (!cache.markets) {
          cache.markets = requestJson('GET', 
            `https://api.projectfina.com/v01/markets/`)
            .then(async ({ markets }) => {

              Object.values(markets || {})
                .forEach(market => market.instruments = {});
              commit(SET, { 
                key: 'markets', 
                value: markets 
              });

              Object.entries(state.instruments || {})
                .forEach(([instrument_uuid, instrument]) => commit(SET, {
                  object: state => state.markets[instrument.market_uuid].instruments,
                  key: instrument_uuid,
                  value: instrument 
                }));
            });

          apolloClient.query({
            query: gql`
              query markets {
                markets {
                  uuid
                  name
                }
              }
            `
          })
          .then(res => console.log(res));
        }
        await cache.markets;

        for (const market_uuid in dependencies.markets) {
          if ((dependencies.markets[market_uuid] || {}).hasOwnProperty('quotesUpdated')) {
            if (!cache.markets[market_uuid])
              cache.markets[market_uuid] = {};

            if (!cache.markets[market_uuid].quotesUpdated) {
              cache.markets[market_uuid].quotesUpdated = requestJson('GET', 
                `https://api.projectfina.com/v01/current/_${state.markets[market_uuid].mic}.json`)
                .then(quotes => {
                  Object.entries(state.markets[market_uuid].instruments)
                    .forEach(([instrument_uuid, instrument]) => {
                      if (quotes.stocks[instrument.symbol]) {
                        commit(SET, instrument.quotes 
                          ? {
                            object: state => state.instruments[instrument_uuid].quotes,
                            key: 'current',
                            value: quotes.stocks[instrument.symbol]
                          }
                          : {
                            object: state => state.instruments[instrument_uuid],
                            key: 'quotes',
                            value: { 'current': quotes.stocks[instrument.symbol] }
                          });

                        if (!cache.instruments[instrument_uuid])
                          cache.instruments[instrument_uuid] = {};
                        if (!cache.instruments[instrument_uuid].quotes)
                          cache.instruments[instrument_uuid].quotes = {};
                        if (!cache.instruments[instrument_uuid].quotes.current)
                          cache.instruments[instrument_uuid].quotes.current = Promise.resolve(quotes.stocks[instrument.symbol]);
                      }
                    });

                    commit(SET, {
                      object: state => state.markets[market_uuid], 
                      key: 'quotesUpdated',
                      value: quotes.dateTime
                    });
                });
            }

            await cache.markets[market_uuid].quotesUpdated;
          }
        }
      }

      if (dependencies.hasOwnProperty('watchlists')) {
        await dispatch('load', { instruments: null });
        if (!cache.watchlists)
          cache.watchlists = requestJson('GET', 
            `https://api.projectfina.com/user/v01/watchlists/`, 
            { bearerToken: state.jwt })
            .then(({ watchlists }) => {
              Object.values(watchlists || {})
                .forEach(watchlist => watchlist.instruments = {});
              commit(SET, { 
                key: 'watchlists', 
                value: watchlists 
              });
            });
        await cache.watchlists;

        for (const watchlist_uuid in dependencies.watchlists || {}) {
          if ((dependencies.watchlists[watchlist_uuid] || {}).hasOwnProperty('instruments')) {
            if (!cache.watchlists[watchlist_uuid])
              cache.watchlists[watchlist_uuid] = {};
            if (!cache.watchlists[watchlist_uuid].instruments)
              cache.watchlists[watchlist_uuid].instruments = requestJson('GET', 
                `https://api.projectfina.com/user/v01/watchlists/${watchlist_uuid}/instruments/`, 
                { bearerToken: state.jwt })
                .then(({ instruments }) => 
                  commit(SET, { 
                    object: state => state.watchlists[watchlist_uuid],
                    key: 'instruments', 
                    value: state => Object.keys(instruments || {})
                      .reduce((instruments, instrument_uuid) => {
                        instruments[instrument_uuid] = state.instruments[instrument_uuid];
                        return instruments;
                      }, {})
                  }));
            await cache.watchlists[watchlist_uuid].instruments;
          }
        }
      }
      
      if (dependencies.hasOwnProperty('groups')) {
        if (!cache.groups)
          cache.groups = requestJson('GET', 
            `https://api.projectfina.com/user/v01/groups/`,
            { bearerToken: state.jwt })
            .then(({ groups }) => commit(SET, { 
              key: 'groups', 
              value: groups 
            }));
        await cache.groups;
      }
    },
    async initialize({ commit }) {
      const jwt = localStorage.getItem('jwt');
      if (jwt)
        commit(SET_JWT, { token: jwt });
    },
    signIn({ commit, dispatch }, { email, password }) {
      return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('POST', 'https://api.projectfina.com/auth', true);
  
        request.onerror = reject;
        request.onload = async function () {
          if (this.status >= 200 && this.status < 400) {
            const data = JSON.parse(this.response);
            commit(SET_JWT, data);
            await resetApolloCache();
            dispatch('load', { groups: null, watchlists: null });
            resolve();
          } else
            reject();
        };
  
        request.send(JSON.stringify({ email, password }));
      });
    },
    async signOut({ commit }) {
      commit(CLEAR_JWT);
      await resetApolloCache();
    },
    async addInstrumentToWatchlist({ state, commit }, { instrument_uuid, watchlist_uuid }) {
      await request('PUT', `https://api.projectfina.com/user/v01/watchlists/${watchlist_uuid}/instruments/${instrument_uuid}/`, { bearerToken: state.jwt });
      commit(ADD_INSTRUMENT_TO_WATCHLIST, { instrument_uuid, watchlist_uuid });
    },
    async removeInstrumentFromWatchlist({ state, commit }, { instrument_uuid, watchlist_uuid }) {
      await request('DELETE', `https://api.projectfina.com/user/v01/watchlists/${watchlist_uuid}/instruments/${instrument_uuid}/`, { bearerToken: state.jwt });
      commit(REMOVE_INSTRUMENT_FROM_WATCHLIST, { instrument_uuid, watchlist_uuid });
    }
  },
  namespaced: true
};
