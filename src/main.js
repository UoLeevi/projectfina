import Vue from 'vue';
import App from './App.vue';
import router from './router'
import store from './store';
import './charts.js';

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('user/initialize');
    this.$store.dispatch('markets/initialize');
  }
}).$mount('#app');
