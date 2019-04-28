<template>
  <v-toolbar app clipped-left height="54">
    <v-toolbar-side-icon flat @click="toggleNavigation" color="grey darken-1" />
    <v-spacer />
    <v-toolbar-title class="headline grey--text text--darken-1">
      <router-link to="/" exact style="text-decoration: none; color: inherit; display:flex; align-items: center;">
        <img src="/assets/favicon-32x32.png" 
          class="mr-3 my-0"
          width="26"
          height="26"
          alt="Project Fina logo"/>
        <span class="">Project Fina</span>
      </router-link>
    </v-toolbar-title>
    <v-spacer />
    <v-fade-transition mode="out-in">
      <LoginForm :dialog.sync="loginForm" v-if="!jwt || loginForm" />
      <v-btn v-else flat @click="signOut" color="grey darken-1">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-fade-transition>
  </v-toolbar>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LoginForm from '@/components/LoginForm';

export default {
  components: {
    LoginForm
  },
  computed: {
    ...mapState('domain', ['jwt'])
  },
  methods: {
    ...mapActions('application', ['toggleNavigation']),
    ...mapActions('domain', ['signOut'])
  },
  data() {
    return {
      loginForm: false
    };
  }
};
</script>
