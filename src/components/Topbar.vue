<template>
  <v-toolbar app clipped-left>
    <v-toolbar-side-icon @click="toggleNavigation" />
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/" exact style="text-decoration: none; color: inherit;">
          <span class="font-weight-light">Project</span>
          <span>Fina</span>
        </router-link>
      </v-toolbar-title>
    <v-spacer />
    <v-fade-transition mode="out-in">
      <LoginForm :dialog.sync="loginForm" v-if="!jwt || loginForm" />
      <v-btn v-else flat @click="signOut">
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
