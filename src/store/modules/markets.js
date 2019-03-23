import Vue from 'vue';
import router from '@/router';

const SET_MARKETS = 'SET_MARKETS';
let fetchMarketsCache = null;

const SET_INSTRUMENTS = 'SET_INSTRUMENTS';
const fetchInstrumentsCache = {};

const SET_CURRENT_QUOTES = 'SET_CURRENT_QUOTES';
const fetchCurrentQuotesCache = {};

const SET_EOD_QUOTES = 'SET_EOD_QUOTES';
const fetchEodQuotesCache = {};

const SELECT_MIC = 'SELECT_MIC';
const SELECT_MARKET = 'SELECT_MARKET';

const SELECT_SYMBOL = 'SELECT_SYMBOL';
const SELECT_INSTRUMENT = 'SELECT_INSTRUMENT';

const state = {
  selection: {
    mic: undefined,
    market: undefined,
    symbol: undefined,
    instrument: undefined
  },
  markets: null
};

const getters = {
  getEodQuotes: (state) => (mic, symbol) => {
    const market = state.markets && state.markets[mic];
    const instrument = market && market.instruments && market.instruments[symbol];

    if (!instrument || !instrument.quotes || !instrument.quotes.eod)
      return null;

    return Object.values(instrument.quotes.eod).reduce(
      (eodQuotes, eodQuotesForOneYear) => Object.assign(eodQuotes, eodQuotesForOneYear), {});
  }
};

const actions = {
  initialize({ state, commit, dispatch }) {
    const marketsPromise = dispatch('fetchMarkets');
    const updateSelection = 
    {
      async market(mic) {
        if (mic !== state.selection.mic) {
          commit(SELECT_MIC, mic);
  
          if (state.symbol)
          {
            commit(SELECT_SYMBOL, null);
            commit(SELECT_INSTRUMENT, null);
          }
  
          if (mic)
          {
            await marketsPromise;
            commit(SELECT_MARKET, state.markets[mic]);
            dispatch('fetchInstruments', { mic });
            dispatch('fetchCurrentQuotes', { mic });
          } else if (state.market)
            commit(SELECT_MARKET, null);
        }
      },
      async instrument(mic, symbol) {
        if (symbol !== state.selection.symbol) {
          commit(SELECT_SYMBOL, symbol);

          if (mic && symbol)
          {
            await marketsPromise;
            await dispatch('fetchInstruments', { mic });
            commit(SELECT_INSTRUMENT, state.markets[mic].instruments[symbol]);
          } else if (state.instrument)
            commit(SELECT_INSTRUMENT, null);
        }
      }
    };
    const { mic, symbol } = router.currentRoute.params;
    updateSelection.market(mic);
    updateSelection.instrument(mic, symbol);

    router.afterEach(async (to) => {
      const { mic, symbol } = to.params;
      updateSelection.market(mic);
      updateSelection.instrument(mic, symbol);
    });
  },
  async fetchMarkets({ commit }) {
    fetchMarketsCache = fetchMarketsCache || new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET',
        `https://api.projectfina.com/v01/markets`, true);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          commit(SET_MARKETS, data);
          resolve();
        } else
          reject(new Error(`Unable to fetch a list of markets!`));
      };

      request.send();
    });

    await fetchMarketsCache;
  },
  async fetchInstruments({ state, commit, dispatch }, { mic }) {
    if (state.markets === null)
      await dispatch('fetchMarkets');

    if (!state.markets[mic])
      throw new Error(`Market ${mic} was not found!`);

    fetchInstrumentsCache[mic] = fetchInstrumentsCache[mic] || new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET',
        `https://api.projectfina.com/v01/markets/${mic}/instruments`, true);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          const instruments = data.instruments;
          commit(SET_INSTRUMENTS, { mic, instruments });
          resolve();
        } else
          reject(new Error(`Unable to fetch instruments for market ${mic}!`));
      };

      request.send();
    });

    await fetchInstrumentsCache[mic];
  },
  async fetchCurrentQuotes({ commit, dispatch }, { mic }) {
    if (state.markets === null)
      await dispatch('fetchMarkets');

    const instrumentsPromise = dispatch('fetchInstruments', { mic });

    fetchCurrentQuotesCache[mic] = fetchCurrentQuotesCache[mic] || new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET',
        `https://api.projectfina.com/v01/current/_${mic}.json`, true);

      request.onerror = reject;
      request.onload = async () => {
        if (request.status >= 200 && request.status < 400) {
          const currentQuotes = JSON.parse(request.response);
          await instrumentsPromise;
          commit(SET_CURRENT_QUOTES, { mic, currentQuotes });
          resolve();
        } else
          reject(new Error(`Unable to fetch current quotes for market ${mic}!`));
      };

      request.send();
    });

    await fetchCurrentQuotesCache[mic];
  },
  async fetchEodQuotes({ commit, dispatch }, { mic, symbol, year }) {
    if (state.markets === null)
      await dispatch('fetchMarkets');

    if (!state.markets[mic] || !state.markets[mic].instruments)
      await dispatch('fetchInstruments', { mic });

    if (year) {
      fetchEodQuotesCache[mic] = fetchEodQuotesCache[mic] || {};
      fetchEodQuotesCache[mic][symbol] = fetchEodQuotesCache[mic][symbol] || {};
      fetchEodQuotesCache[mic][symbol][year] = fetchEodQuotesCache[mic][symbol][year] || new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET',
          `https://api.projectfina.com/v01/eod/${year}/${mic}/${symbol[0]}/_${symbol}.json`, true);

        request.onerror = reject;
        request.onload = function () {
          if (this.status >= 200 && this.status < 400) {
            const quotes = JSON.parse(this.response);
            commit(SET_EOD_QUOTES, { mic, symbol, year, quotes });
            resolve();
          } else
            reject(new Error(`Unable to fetch ${symbol} EOD quotes for year ${year}!`));
        };

        request.send();
      });

      await fetchEodQuotesCache[mic][symbol][year];
    } else {
      const year = new Date().getUTCFullYear();
      const currentYearQuotesPromise = dispatch('fetchEodQuotes', { mic, symbol, year });
      const previousYearQuotesPromise = dispatch('fetchEodQuotes', { mic, symbol, year: year - 1 });
      await new Promise((resolve, reject) => {
        currentYearQuotesPromise.then(
          () => previousYearQuotesPromise.finally(() => resolve()),
          () => previousYearQuotesPromise.then(
            () => resolve(),
            () => reject(new Error(`Unable to fetch ${symbol} EOD quotes!`))));
      });
    }
  }
};

const mutations = {
  [SET_MARKETS](state, { markets }) {
    state.markets = markets;
  },
  [SET_INSTRUMENTS](state, { mic, instruments }) {
    Vue.set(state.markets[mic], 'instruments', instruments);
  },
  [SET_CURRENT_QUOTES](state, { mic, currentQuotes }) {
    Vue.set(state.markets[mic], 'updated', currentQuotes.dateTime);
    const symbols = Object.keys(currentQuotes.stocks);
    const instruments = state.markets[mic].instruments;
    symbols.forEach(symbol => {
      const instrument = instruments[symbol];
      if (instrument)
      {
        if (!instrument.quotes)
          Vue.set(instrument, 'quotes', { 'current': currentQuotes.stocks[symbol] });
        else if (!instrument.quotes.current)
          Vue.set(instrument.quotes, 'current', currentQuotes.stocks[symbol]);
        else
          instrument.quotes.current = currentQuotes.stocks[symbol];
      }
    });
  },
  [SET_EOD_QUOTES](state, { mic, symbol, year, quotes }) {
    const instrument = state.markets[mic].instruments[symbol];
    if (!instrument.quotes)
      Vue.set(instrument, 'quotes', { 'eod': { [year]: quotes } });
    else if (!instrument.quotes.eod)
      Vue.set(instrument.quotes, 'eod', { [year]: quotes });
    else
      instrument.quotes.eod[year] = quotes;
  },
  [SELECT_MIC](state, mic) {
    state.selection.mic = mic;
  },
  [SELECT_MARKET](state, market) {
    state.selection.market = market;
  },
  [SELECT_SYMBOL](state, symbol) {
    state.selection.symbol = symbol;
  },
  [SELECT_INSTRUMENT](state, instrument) {
    state.selection.instrument = instrument;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};