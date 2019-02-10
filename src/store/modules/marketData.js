let fetchStocksCache = {};
let fetchQuotesCache = {};

const state = {
  markets: {
    'XHEL': {
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

    return fetchStocksCache[mic];
  },
  fetchQuotes({ commit }, { mic, symbol, year }) {
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
  }
};

const mutations = {
  ADD_STOCKS(state, { mic, stocks }) {
    state.markets[mic].stocks = stocks;
  },
  ADD_QUOTES(state, { mic, symbol, year, quotes }) {
    let market = state.quotes.eod[mic] = state.quotes.eod[mic] || {};
    let instrument = market[symbol] = market[symbol] || {};
    instrument[year] = quotes;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};