const SET_JWT = 'SET_JWT';
const CLEAR_JWT = 'CLEAR_JWT';
const SET_GROUPS = 'SET_GROUPS';

const state = {
  jwt: null,
  userUuid: null,
  firstName: null,
  lastName: null,
  email: null,
  groups: {},
  watchlists: {}
};

const getters = {

};

const actions = {
  initialize({ commit, dispatch }) {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
      commit(SET_JWT, { token: jwt });
      dispatch('fetchGroups');
    }
  },
  logIn({ commit, dispatch }, { email, password }) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('POST', 'https://api.projectfina.com/auth', true);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          commit(SET_JWT, data);
          dispatch('fetchGroups').finally(resolve());
        } else
          reject();
      };

      request.send(JSON.stringify({ email, password }));
    });
  },
  logOut({ commit }) {
    commit(CLEAR_JWT);
  },
  fetchGroups({ commit, state }) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET', 'https://api.projectfina.com/user/groups', true);
      request.setRequestHeader('authorization', `Bearer ${state.jwt}`);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          commit(SET_GROUPS, data);
          resolve();
        } else
          reject();
      };

      request.send();
    });
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
    state.jwt = null;
    state.userUuid = null;
    state.firstName = null;
    state.lastName = null;
    state.email = null;
    state.groups = {};
    state.watchlists = {};
    sessionStorage.clear();
  },
  [SET_GROUPS](state, { groups }) {
    state.groups = groups;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};