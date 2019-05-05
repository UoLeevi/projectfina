<template>
  <li class="mx-1 mb-2">
    <v-divider class="my-1" />
    <span class="caption">{{ dateTimeString(note.created) }}</span>
    <span class="caption font-weight-bold ml-1">{{ note.created_by.name }}</span>
    <v-btn v-if="!loading && note.created_by.uuid === graph.me.uuid"
        class="my-0 ml-1"
        color="red"
        flat
        small
        icon
        @click="deleteNote()">
        <v-icon>remove</v-icon>
      </v-btn>
    <p class="my-1 font-mono">{{ note.body }}</p>
  </li>
</template>

<script>
import { dateTimeString } from '@/utilities';
import GraphQLMixin from '@/mixins/GraphQLMixin';
import gql from 'graphql-tag';

export default {
  mixins: [GraphQLMixin],
  props: {
    instrument_uuid: String,
    watchlist_uuid: String,
    note: Object
  },
  data() {
    return {
      processing: false,
      watchQuery: {
        query: gql`{
          me {
            uuid
          }
        }`
      }
    };
  },
  methods: {
    dateTimeString,
    async deleteNote() {
      this.processing = true
      const res = await this.client.mutate({
        mutation: gql`mutation($note_uuid: ID!) {
          deleteNote(note_uuid: $note_uuid) {
            success
            message
          }
        }`,
        variables: {
          note_uuid: this.note.uuid
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

      this.processing = false;
    }
  }
};
</script>
