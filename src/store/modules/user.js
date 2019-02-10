
const state = {
  jwt: null
};

const getters = {

};

const actions = {
  logIn({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('POST', 'https://api.projectfina.com/auth', true);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          var data = JSON.parse(this.response);
          commit('SET_JWT', data);
          resolve();
        } else
          reject();
      };

      request.send(JSON.stringify({ email: email, password: password }));
    });
  }
};

const mutations = {
  SET_JWT(state, { jwt }) {
    state.jwt = jwt;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};