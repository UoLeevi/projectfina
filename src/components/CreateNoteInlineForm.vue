<template>
  <v-card flat>
    <v-form @submit.prevent="submit" ref="form" class="px-3 pt-4 pb-0 mx-0">
      <v-textarea v-model="body" class="font-mono body-1 mx-1"
        spellcheck="false"
        label="Write a note"
        outline
        hint="This note is a private to you"/>
    <v-card-actions class="pt-0">
      <v-btn flat small type="submit" :loading="processing" :disabled="body === ''" color="primary">Add note</v-btn>
      <v-btn flat small :disabled="body === ''" @click="$refs.form.reset()">Clear</v-btn>
      <v-spacer />
    </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import GraphQLMixin from '@/mixins/GraphQLMixin';
import gql from 'graphql-tag';

export default {
  mixins: [GraphQLMixin],
  props: {
    instrument_uuid: String,
    watchlist_uuid: String
  },
  data() {
    return {
      processing: false,
      body: '',
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate())
      {
        this.processing = true
        const res = await this.client.mutate({
          mutation: gql`mutation($instrument_uuid: ID!, $watchlist_uuid: ID, $body: String!) {
            createNote(instrument_uuid: $instrument_uuid, watchlist_uuid: $watchlist_uuid, body: $body) {
              success
              message
            }
          }`,
          variables: {
            instrument_uuid: this.instrument_uuid,
            watchlist_uuid: this.watchlist_uuid,
            body: this.body
          },
          refetchQueries: [{
            query: gql`query($instrument_uuid: ID!, $watchlist_uuid: ID) {
              me {
                uuid
              }
              instruments(uuid: $instrument_uuid) {
                uuid
                notesConnection(watchlist_uuid: $watchlist_uuid) {
                  edges {
                    node {
                      uuid
                      body
                      created_by {
                        uuid
                        name
                      }
                      created
                    }
                  }
                }
              }
            }`,
            variables: {
              instrument_uuid: this.instrument_uuid,
              watchlist_uuid: this.watchlist_uuid
            }
          }]
        });
        this.$refs.form.reset();
        this.processing = false;
      }
    }
  }
};
</script>

