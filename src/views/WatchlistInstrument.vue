<template>
  <v-container>
    <u-heading-row :heading="instrument && instrument.name" :breadcrumbs="breadcrumbs"/>
    <v-card>
    <InstrumentCard v-if="instrument" :instrument_uuid="$route.params.instrument_uuid" />
    <v-flex xs12 xl6>
      <NotesCard v-if="graph.me && instrument" :instrument_uuid="$route.params.instrument_uuid" :watchlist_uuid="$route.params.watchlist_uuid" />
    </v-flex>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import InstrumentCard from '@/components/InstrumentCard';
import NotesCard from '@/components/NotesCard';
import UHeadingRow from '@/components/UHeadingRow';
import GraphQLMixin from '@/mixins/GraphQLMixin';
import gql from 'graphql-tag';

export default {
  mixins: [GraphQLMixin],
  components: {
    InstrumentCard,
    NotesCard,
    UHeadingRow
  },
  computed: {
    watchlist() {
      return this.loading || this.error ? null : this.graph.me.watchlistsConnection.edges
        .map(edge => edge.node)
        .find(watchlist => watchlist.uuid === this.$route.params.watchlist_uuid);
    },
    instrument() {
      return this.watchlist
        ? this.watchlist.instruments
          .find(instrument => instrument.uuid === this.$route.params.instrument_uuid)
        : null;
    },
    breadcrumbs() {
      return this.loading ? [] : [
        {
          href: `/watchlists/${this.$route.params.watchlist_uuid}`,
          text: this.watchlist.name
        },
        {
          href: `/watchlists/${this.$route.params.watchlist_uuid}/instruments/${this.$route.params.instrument_uuid}`,
          text: this.instrument.name,
          disabled: true
        }
      ]
    }
  },
  data() {
    return {
      processing: false,
      watchQuery: {
        query: gql`query($instrument_uuid: ID!, $watchlist_uuid: ID!) {
          me {
            uuid
            watchlistsConnection(uuid: $watchlist_uuid) {
              edges {
                permission_mask
                node {
                  uuid
                  name
                  instruments(uuid: $instrument_uuid) {
                    uuid
                    name
                  }
                }
              }
            }
          }
        }`,
        variables: {
          instrument_uuid: this.$route.params.instrument_uuid,
          watchlist_uuid: this.$route.params.watchlist_uuid
        }
      }
    };
  }
};
</script>
