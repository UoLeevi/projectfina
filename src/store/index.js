import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import markets from './modules/markets';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    markets,
  }
});
