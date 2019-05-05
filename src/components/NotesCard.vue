<template>
  <v-flex xs12 xl6>
    <CreateNoteInlineForm v-if="graph.me" :instrument_uuid="instrument_uuid" :watchlist_uuid="watchlist_uuid" />
    <ul class="pb-2">
      <NoteListItem v-for="note in notes" :key="note.uuid" :note="note" :instrument_uuid="instrument_uuid" :watchlist_uuid="watchlist_uuid"/>
    </ul>
  </v-flex>
</template>

<script>
import GraphQLMixin from '@/mixins/GraphQLMixin';
import CreateNoteInlineForm from '@/components/CreateNoteInlineForm';
import NoteListItem from '@/components/NoteListItem';
import gql from 'graphql-tag';

export default {
  mixins: [GraphQLMixin],
  components: {
    CreateNoteInlineForm,
    NoteListItem
  },
  props: {
    instrument_uuid: String,
    watchlist_uuid: String
  },
  computed: {
    instrument() {
      return this.loading ? null : this.graph.instruments
        .find(instrument => instrument.uuid = this.instrument_uuid);
    },
    notes() {
      return this.loading
        ? []
        : this.instrument.notesConnection.edges
          .map(edge => edge.node)
          .sort((a, b) => a.created > b.created ? -1 : 1);
    }
  },
  data() {
    return {
      watchQuery: {
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
      }
    };
  }
}
</script>
