<template>
  <v-app>
    <Topbar />
    <Navigation />
    <v-content>
      <v-progress-linear :indeterminate="!isRouteReady" class="ma-0" height="4"></v-progress-linear>
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-content>
    <v-snackbar :color="message.color" v-model="message.isVisible" :timeout="message.timeout" right>
      <span>{{ message.text }}</span>
      <v-btn flat @click="hideMessage">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Topbar from '@/components/Topbar';
import Navigation from '@/components/Navigation';

export default {
  name: 'App',
  components: {
    Topbar,
    Navigation
  },
  computed: {
    ...mapState('application', ['message'])
  },
  methods: {
    ...mapActions('application', ['hideMessage'])
  },
  data () {
    return {
      isRouteReady: true
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.isRouteReady = false;
      next();
    });

    this.$router.afterEach((to, from) => this.isRouteReady = true)
  }
};
</script>
