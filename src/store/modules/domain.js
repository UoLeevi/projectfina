import Vue from 'vue';
import { client } from '@/apollo';
import { request } from '@/utilities';
import router from '@/router';

const SET_JWT = 'SET_JWT';
const CLEAR_JWT = 'CLEAR_JWT';

const ADD_INSTRUMENT_TO_WATCHLIST = 'ADD_INSTRUMENT_TO_WATCHLIST';
const REMOVE_INSTRUMENT_FROM_WATCHLIST = 'REMOVE_INSTRUMENT_FROM_WATCHLIST';

export default {
  state: {
    jwt: null
  },
  mutations: {
    [SET_JWT](state, { token }) {
      state.jwt = token;
      localStorage.setItem('jwt', token);
    },
    [CLEAR_JWT](state) {
      state.jwt = null;
      localStorage.removeItem('jwt');
    },
    [ADD_INSTRUMENT_TO_WATCHLIST](state, { instrument_uuid, watchlist_uuid }) {
      Vue.set(state.watchlists[watchlist_uuid].instruments, instrument_uuid, state.instruments[instrument_uuid]);
    },
    [REMOVE_INSTRUMENT_FROM_WATCHLIST](state, { instrument_uuid, watchlist_uuid }) {
      Vue.delete(state.watchlists[watchlist_uuid].instruments, instrument_uuid);
    }
  },
  actions: {
    async initialize({ commit }) {
      const jwt = localStorage.getItem('jwt');
      if (jwt)
        commit(SET_JWT, { token: jwt });
    },
    signIn({ commit }, { email, password }) {
      return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('POST', 'https://api.projectfina.com/auth', true);

        request.onerror = reject;
        request.onload = async function () {
          if (this.status >= 200 && this.status < 400) {
            const data = JSON.parse(this.response);
            commit(SET_JWT, data);
            await client.clearStore();
            resolve();
          } else
            reject();
        };
  
        request.send(JSON.stringify({ email, password }));
      });
    },
    async signOut({ commit }) {
      router.push({ path: '/' });
      commit(CLEAR_JWT);
      await client.clearStore();
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
