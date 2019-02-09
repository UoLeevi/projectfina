
const state = {
  markets: {
    'XHEL': {
      instruments: [
        'ELISA',
        'NOKIA',
        'UUTEC'
      ]
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
  fetchQuotes({ commit }, { mic, symbol, years }) {
    years.forEach(year => {
      var request = new XMLHttpRequest();
      request.open('GET',
        `https://api.projectfina.com/v01/eod/${year}/${mic}/${symbol[0]}/_${symbol}.json}`, true);

      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          var data = JSON.parse(this.response);
          for (const year in data) {
            if (data.hasOwnProperty(year)) {
              const quotes = data[year];
              commit('ADD_QUOTES', { mic, symbol, year, quotes });
            }
          }
        } else
          // eslint-disable-next-line
          console.log("error while requesting quotes");
      };

      request.send();
    });
  }
};

const mutations = {
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