import Vue from 'vue';
import Vuex from 'vuex';

const SHOW_MESSAGE = 'SHOW_MESSAGE';
const HIDE_MESSAGE = 'HIDE_MESSAGE';
const SHOW_NAVIGATION = 'SHOW_NAVIGATION';
const HIDE_NAVIGATION = 'HIDE_NAVIGATION';

export default {
  state: {
    message: {
      isVisible: false,
      timeout: 3000,
      color: undefined,
      text: ''
    },
    navigation: {
      isVisible: false
    }
  },
  mutations: {
    [SHOW_MESSAGE](state, { text, color, timeout }) {
      state.message.text = text;
      state.message.color = color || undefined;
      state.message.timeout = timeout || 3000;
      state.message.isVisible = true;
    },
    [HIDE_MESSAGE](state) {
      state.message.isVisible = false;
    },
    [SHOW_NAVIGATION](state) {
      state.navigation.isVisible = true;
    },
    [HIDE_NAVIGATION](state) {
      state.navigation.isVisible = false;
    }
  },
  actions: {
    initialize() {
      return new Promise((resolve) => {
        resolve();
      });
    },
    showMessage({ commit }, { color, text }) {
      return new Promise((resolve) => {
        commit(SHOW_MESSAGE, { text, color });
        resolve();
      });
    },
    hideMessage({ commit }) {
      return new Promise((resolve) => {
        commit(HIDE_MESSAGE);
        resolve();
      });
    },
    toggleNavigation({ state, commit }) {
      return new Promise((resolve) => {
        commit(state.navigation.isVisible ? HIDE_NAVIGATION : SHOW_NAVIGATION);
        resolve();
      });
    },
    showNavigation({ commit }) {
      return new Promise((resolve) => {
        commit(SHOW_NAVIGATION);
        resolve();
      });
    },
    hideNavigation({ commit }) {
      return new Promise((resolve) => {
        commit(HIDE_NAVIGATION);
        resolve();
      });
    }
  },
  namespaced: true
};
