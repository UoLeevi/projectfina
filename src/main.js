import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', 
//     async () => await navigator.serviceWorker.register('sw.js'));
// }

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('application/initialize');
    this.$store.dispatch('domain/initialize');
  }
}).$mount('#app');
