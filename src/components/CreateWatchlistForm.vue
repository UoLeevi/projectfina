<template>
  <v-dialog max-width="600px" v-model="value">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" flat small icon v-on="on">
        <v-icon>add</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title><h2>Create Watchlist</h2></v-card-title>
      <v-card-text>
      <v-form class="px-3 py-2" @submit.prevent="submit" ref="form">
        <v-text-field label="Name" 
          :rules="[rules.required]"
          type="text" 
          v-model="name" 
          spellcheck="false"/>
        <v-btn class="primary mt-4" type="submit" :loading="processing">
          <span>Create</span>
        </v-btn>
      </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import GraphQLMixin from '@/mixins/GraphQLMixin';
import gql from 'graphql-tag';

export default {
  mixins: [GraphQLMixin],
  props: {
    dialog: Boolean
  },
  data() {
    return {
      name: '',
      rules: {
        required: v => !!v || 'Required',
        //nameExists: v => v. || 'Watchlist name already exists'
      },
      processing: false,
      watchQuery: `query myWatchlistNames {
        me {
          uuid
          watchlistsConnection {
            edges {
              node {
                uuid
                name
              }
            }
          }
        }
      }`
    }
  },
  computed: {
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
        const res = await this.client.mutate({
          mutation: gql`mutation($watchlist: WatchlistInput!) {
            createWatchlist(watchlist: $watchlist) {
              uuid
              name
            }
          }`,
          variables: {
            watchlist: {
              name: this.name
            }
          },
          refetchQueries: [
            'myWatchlistNames',
            'myBasicInfo'
          ]
        });
        console.log(res);
        this.showMessage({
          color: 'info',
          text: `Watchlist ${ this.name } created`
        });
        this.value = false;
        this.processing = false;
      }
    },
    ...mapActions('application', ['showMessage']),
  }
}
</script>

<style>

</style>
