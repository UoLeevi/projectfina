import Vue from 'vue';

const SET_JWT = 'SET_JWT';
const CLEAR_JWT = 'CLEAR_JWT';
const SET_GROUPS = 'SET_GROUPS';
const SET_WATCHLISTS = 'SET_WATCHLISTS';
const SET_NOTES_FOR_INSTUMENT = 'SET_NOTES_FOR_INSTRUMENT'

const state = {
  jwt: null,
  userUuid: null,
  firstName: null,
  lastName: null,
  email: null,
  groups: {},
  watchlists: {},
  notesByInstrument: {}
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
  fetchNotesForInstrument({ commit, state }, { instrument_uuid }) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET', `https://api.projectfina.com/user/instruments/${instrument_uuid}/notes`, true);
      request.setRequestHeader('authorization', `Bearer ${state.jwt}`);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const data = JSON.parse(this.response);
          commit(SET_NOTES_FOR_INSTUMENT, { instrument_uuid, notes: data.notes });
          resolve();
        } else
          reject();
      };

      request.send();
    });
  },
  createNote({ state }, note) {
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
          resolve();
        } else
          reject();
      };

      request.send(JSON.stringify(note));
    });
  },
  addNoteToInstrument(_ , { note_uuid, instrument_uuid }) {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('PUT',
        `https://api.projectfina.com/user/notes/${note_uuid}/instruments/${instrument_uuid}/`, true);
      request.setRequestHeader('authorization', `Bearer ${state.jwt}`);

      request.onerror = reject;
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
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
  [SET_NOTES_FOR_INSTUMENT](state, { instrument_uuid, notes }) {
    if (state.notesByInstrument[instrument_uuid])
    {
      const n_x_i_uuids = Object.keys(notes);
      n_x_i_uuids.forEach(n_x_i_uuid => Vue.set(state.notesByInstrument[instrument_uuid], n_x_i_uuid, notes[n_x_i_uuid]));
    }
    else
      Vue.set(state.notesByInstrument, instrument_uuid, notes);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};