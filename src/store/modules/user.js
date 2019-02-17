const SET_JWT = 'SET_JWT';
const CLEAR_JWT = 'CLEAR_JWT';

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
  initialize({ commit }) {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt)
      commit(SET_JWT, { token: jwt });
  },
  logIn({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('POST', 'https://api.projectfina.com/auth', true);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          commit(SET_JWT, data);
          resolve();
        } else
          reject();
      };

      request.send(JSON.stringify({ email: email, password: password }));
    });
  },
  logOut({ commit }) {
    commit(CLEAR_JWT);
  }
};

const mutations = {
  [SET_JWT](state, { token }) {
    state.jwt = token;
    const claims = JSON.parse(atob(token.split('.')[1]));
    state.userUuid = claims.sub;
    state.firstName = claims.given_name;
    state.lastName = claims.family_name;
    state.email = claims.email;
    sessionStorage.setItem('jwt', token);
  },
  [CLEAR_JWT](state) {
    Object.keys(state).forEach(k => state[k] = null);
    sessionStorage.clear();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};