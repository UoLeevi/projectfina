
const state = {
  jwt: null,
  userUuid: null,
  firstName: null,
  lastName: null,
  email: null
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
          const data = JSON.parse(this.response);
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
  SET_JWT(state, { token }) {
    state.jwt = token;
    const claims = JSON.parse(atob(token.split('.')[1]));
    state.userUuid = claims.sub;
    state.firstName = claims.given_name;
    state.lastName = claims.family_name;
    state.email = claims.email;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};