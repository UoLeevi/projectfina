
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
    var request = new XMLHttpRequest();
    request.open('GET',
      `https://api.projectfina.com/v01/stocks/_${mic}.json`, true);

    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        const stocks = JSON.parse(this.response);
        commit('ADD_STOCKS', { mic, stocks });
      } else
        // eslint-disable-next-line
        console.log("error while requesting stocks");
    };

    request.send();
  },
  fetchQuotes({ commit }, { mic, symbol, years }) {
    years.forEach(year => {
      var request = new XMLHttpRequest();
      request.open('GET',
        `https://api.projectfina.com/v01/eod/${year}/${mic}/${symbol[0]}/_${symbol}.json`, true);

      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const quotes = JSON.parse(this.response);
          commit('ADD_QUOTES', { mic, symbol, year, quotes });
        } else
          // eslint-disable-next-line
          console.log("error while requesting quotes");
      };

      request.send();
    });
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