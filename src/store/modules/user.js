
const state = {
  isLoggedIn: false,
  isRequesting: false
};

const getters = {
  
};

const actions = {
  logIn({ commit }, { email, password }) {
    commit('START_REQUEST');
    var request = new XMLHttpRequest();
    request.open('POST', 'https://api.projectfina.com/auth', true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var data = JSON.parse(this.response);
        commit('SET_USER', null);
      } else {
        // We reached our target server, but it returned an error
        console.log("login error");
      }
      commit('END_REQUEST');
    };

    request.onerror = function() {
      console.log("login error");
      commit('END_REQUEST');
    };

    request.send(JSON.stringify({ email: email, password: password}));
  }
};

const mutations = {
  SET_USER(state, user) {
    state.isLoggedIn = true;
  },
  START_REQUEST(state) {
    state.isRequesting = true;
  },
  END_REQUEST(state) {
    state.isRequesting = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};