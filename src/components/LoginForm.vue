<template>
  <v-dialog max-width="600px" v-model="value">
    <template v-slot:activator="{ on }">
      <v-btn flat v-on="on">
        <span>Sign In</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title><h2>Sign In</h2></v-card-title>
      <v-card-text>
      <v-form class="px-3 py-2" @submit.prevent="submit" ref="form">
        <v-text-field label="email" 
          :rules="[rules.required, rules.emailFormat]"
          type="email" 
          v-model="email" 
          spellcheck="false"/>
        <v-text-field label="password" 
          :append-icon="isPasswordVisible ? 'visibility' : 'visibility_off'" 
          :type="isPasswordVisible ? 'text' : 'password'" 
          :rules="[rules.required, rules.minLength]"
          v-model="password" 
          spellcheck="false"
          @click:append="isPasswordVisible = !isPasswordVisible"/>
        <v-btn class="primary mt-4" type="submit" :loading="processing">
          <span>Sign In</span>
        </v-btn>
      </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import GraphQLMixin from '@/mixins/GraphQLMixin';

export default {
  mixins: [GraphQLMixin],
  props: {
    dialog: Boolean
  },
  data() {
    return {
      email: '',
      password: '',
      isPasswordVisible: false,
      rules: {
        required: v => !!v || 'Required',
        minLength: v => v.length >= 6 || 'Min 6 characters',
        emailFormat: v => /^\S+@\S+$/.test(v) || 'Email address does not have correct format'
      },
      processing: false,
      load: `{
        me {
          uuid
          first_name
        }
      }`
    }
  },
  computed: {
    ...mapState('domain', ['user']),
    value: {
      get() {
        return this.dialog;
      },
      set(value) {
        this.$emit('update:dialog', value)
      }
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate())
      {
        this.processing = true
        await this.signIn({ email: this.email, password: this.password });
        this.showMessage({
          color: 'success',
          text: `${ this.graph.me.first_name } signed in`
        });
        this.value = false;
        this.processing = false;
      }
    },
    ...mapActions('application', ['showMessage']),
    ...mapActions('domain', ['signIn'])
  }
}
</script>

<style>

</style>
