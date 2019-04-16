<template>
  <v-app>
    <Topbar />
    <Navigation />
    <v-content>
      <v-fade-transition>
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
      //
    }
  }
};
</script>
