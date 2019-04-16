import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import apolloProvider from './vue-apollo'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
  created() {
    this.$store.dispatch('application/initialize');
    this.$store.dispatch('domain/initialize');
  }
}).$mount('#app');
