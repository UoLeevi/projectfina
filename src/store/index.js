import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import marketData from './modules/marketData';
import investments from './modules/investments';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    marketData,
    investments
  }
});
