import Vue from 'vue';

const SET_JWT = 'SET_JWT';
const CLEAR_JWT = 'CLEAR_JWT';
const SET_GROUPS = 'SET_GROUPS';
const SET_WATCHLISTS = 'SET_WATCHLISTS';
const ADD_NOTE = 'ADD_NOTE';
const ADD_NOTE_TO_INSTRUMENT = 'ADD_NOTE_TO_INSTRUMENT';

const state = {
  jwt: null,
  userUuid: null,
  firstName: null,
  lastName: null,
  email: null,
  groups: {},
  watchlists: {},
  notes: {}
};

const getters = {

};

const actions = {
  initialize({ commit, dispatch }) {
    const jwt = sessionStorage.getItem('jwt');
    if (jwt) {
      commit(SET_JWT, { token: jwt });
      dispatch('fetchGroups');
      dispatch('fetchWatchlists');
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
          dispatch('fetchGroups');
          dispatch('fetchWatchlists');
          resolve();
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
  },
  fetchWatchlists({ commit, state }) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET', 'https://api.projectfina.com/user/watchlists', true);
      request.setRequestHeader('authorization', `Bearer ${state.jwt}`);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          commit(SET_WATCHLISTS, data);
          resolve();
        } else
          reject();
      };

      request.send();
    });
  },
  createNote({ commit, state }, note) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('POST', 'https://api.projectfina.com/user/notes', true);
      request.setRequestHeader('authorization', `Bearer ${state.jwt}`);
      request.setRequestHeader('content-type', 'application/json');

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          note.uuid = data.note_uuid;
          commit(ADD_NOTE, note);
          resolve();
        } else
          reject();
      };

      request.send(JSON.stringify(note));
    });
  },
  addNoteToInstrument({ commit, dispatch }, { note_uuid, instrument_uuid }) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('PUT',
        `https://api.projectfina.com/user/notes/${note_uuid}/instruments/${instrument_uuid}/`, true);
      request.setRequestHeader('authorization', `Bearer ${state.jwt}`);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          commit(ADD_NOTE_TO_INSTRUMENT, { note_uuid, instrument_uuid, note_x_instrument_uuid: data.note_x_instrument_uuid });
          resolve();
        } else
          reject(new Error(`Unable to add note for instrument!`));
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
  },
  [SET_WATCHLISTS](state, { watchlists }) {
    state.watchlists = watchlists;
  },
  [ADD_NOTE](state, { uuid, body }) {
    Vue.set(state.notes, uuid, { uuid, body });
  },
  [ADD_NOTE_TO_INSTRUMENT](state, { note_uuid, instrument_uuid, note_x_instrument_uuid }) {
    // TODO
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};