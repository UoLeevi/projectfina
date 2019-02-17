import Vue from 'vue';

const fetchStocksCache = {};
const fetchCurrentCache = {};
const fetchQuotesCache = {};

const state = {
  updated: null,
  markets: {
    'XHEL': {
      name: 'Nasdaq Helsinki',
      stocks: null
    }
  },
  quotes: {
    eod: {

    }
  }
};

const getters = {

};

const actions = {
  fetchStocks({ commit }, { mic }) {
    fetchStocksCache[mic] = fetchStocksCache[mic] || new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET',
        `https://api.projectfina.com/v01/stocks/_${mic}.json`, true);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const stocks = JSON.parse(this.response);
          commit('ADD_STOCKS', { mic, stocks });
          resolve();
        } else
          reject();
      };

      request.send();
    });

    fetchCurrentCache[mic] = fetchCurrentCache[mic] || new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET',
        `https://api.projectfina.com/v01/current/_${mic}.json`, true);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const marketData = JSON.parse(this.response);
          fetchStocksCache[mic].then(
            () => {
              commit('UPDATE_CURRENT', { mic, marketData });
              resolve();
            }, () => reject())
        } else
          reject();
      };

      request.send();
    });

    return Promise.all([fetchStocksCache[mic], fetchCurrentCache[mic]]);
  },
  fetchQuotes({ commit }, { mic, symbol, year }) {
    if (year) {
      fetchQuotesCache[mic] = fetchQuotesCache[mic] || {};
      fetchQuotesCache[mic][symbol] = fetchQuotesCache[mic][symbol] || {};
      fetchQuotesCache[mic][symbol][year] = fetchQuotesCache[mic][symbol][year] || new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('GET',
          `https://api.projectfina.com/v01/eod/${year}/${mic}/${symbol[0]}/_${symbol}.json`, true);

        request.onerror = reject;
        request.onload = function () {
          if (this.status >= 200 && this.status < 400) {
            const quotes = JSON.parse(this.response);
            commit('ADD_QUOTES', { mic, symbol, year, quotes });
            resolve();
          } else
            reject();
        };

        request.send();
      });

      return fetchQuotesCache[mic][symbol][year];
    } else {
      let year = new Date().getUTCFullYear();
      let currentYearQuotesPromise = this.dispatch('marketData/fetchQuotes', { mic, symbol, year });
      let previousYearQuotesPromise = this.dispatch('marketData/fetchQuotes', { mic, symbol, year: year - 1 });
      return new Promise((resolve, reject) => {
        currentYearQuotesPromise.then(
          () => previousYearQuotesPromise.finally(() => resolve()), 
          () => previousYearQuotesPromise.then(
            () => resolve(), 
            () => reject()));
      });
    }
  }
};

const mutations = {
  ADD_STOCKS(state, { mic, stocks }) {
    state.markets[mic].stocks = stocks;
  },
  UPDATE_CURRENT(state, { mic, marketData }) {
    state.updated = marketData.dateTime;
    const symbols = Object.keys(marketData.stocks);
    symbols.forEach(symbol => {
      var stock = state.markets[mic].stocks[symbol];
      if (stock)
        Vue.set(stock, 'current', marketData.stocks[symbol]);
    });
  },
  ADD_QUOTES(state, { mic, symbol, year, quotes }) {
    if (!state.quotes.eod[mic])
      Vue.set(state.quotes.eod, mic, { [symbol]: { [year]: quotes } });
    else if (!state.quotes.eod[mic][symbol])
      Vue.set(state.quotes.eod[mic], symbol, { [year]: quotes });
    else if (!state.quotes.eod[mic][symbol][year])
      Vue.set(state.quotes.eod[mic][symbol], year, quotes);
    else
      state.quotes.eod[mic][symbol][year] = quotes;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};