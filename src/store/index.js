import Vue from 'vue';
import Vuex from 'vuex';
import application from './modules/application';
import domain from './modules/domain';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    application,
    domain,
  }
});
