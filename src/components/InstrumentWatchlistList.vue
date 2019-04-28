<template>
  <ul v-if="!loading" :style="{ 'list-style': 'none', 'padding': '0 4px' }">
    <li v-for="watchlist in watchlists
        .filter(watchlist => watchlist.includesInstrument)"
      :key="watchlist.uuid" >
      <span class="px-1 pb-1 font-weight-bold body-2 grey--text text--darken-3 font-mono" >{{ watchlist.name }}</span>
      <v-btn v-if="watchlist.canEdit"
        class="my-0 ml-1"
        color="red"
        flat
        small
        icon
        @click="removeFromWatchlist(watchlist.uuid)">
        <v-icon>remove</v-icon>
      </v-btn>
    </li>
    <li>
    <v-menu bottom right v-if="watchlists
      .some(watchlist => watchlist.canEdit && !watchlist.includesInstrument)">
      <template #activator="{ on }">
        <v-btn color="primary" flat small icon v-on="on">
          <v-icon>add</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-tile
          v-for="watchlist in watchlists
            .filter(watchlist => watchlist.canEdit && !watchlist.includesInstrument)"
          :key="watchlist.uuid"
          @click="addToWatchlist(watchlist.uuid)">
          <v-list-tile-title>{{ watchlist.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    </li>
  </ul>
</template>

<script>
import { mapActions } from 'vuex';
import GraphQLMixin from "@/mixins/GraphQLMixin";
import gql from 'graphql-tag';

export default {
  mixins: [GraphQLMixin],
  props: {
    instrument_uuid: String
  },
  computed: {
    instrument() {
      return this.loading ? null : this.graph.instruments[0];
    },
    watchlists() {
      return this.loading
        ? []
        : this.graph.me.watchlistsConnection.edges.map(edge => ({
            uuid: edge.node.uuid,
            name: edge.node.name,
            canEdit:
              (parseInt(edge.permission_mask + "", 2) & 0b00001000) !== 0,
            includesInstrument: edge.node.instruments.some(
              instrument => instrument.uuid === this.instrument.uuid
            )
          }));
    }
  },
  methods: {
    async addToWatchlist(watchlist_uuid) {
      this.processing = true
      const name = this.instrument.name;
      const res = await this.client.mutate({
        mutation: gql`mutation {
          addToWatchlist(instrument_uuid: "${this.instrument_uuid}", watchlist_uuid: "${watchlist_uuid}") {
            success
            message
          }
        }`,
        refetchQueries: [{
          query: gql`
            {
              me {
                uuid
                watchlistsConnection(uuid: "${watchlist_uuid}") {
                  edges {
                    node {
                      uuid
                      instruments {
                        uuid
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { repoName: 'apollographql/apollo-client' },
        }]
      });
      const success = res.data.addToWatchlist.success;
      this.showMessage({
        color: success 
          ? 'info' 
          : 'warning',
        text: success 
          ? `Instrument ${ name } added to watchlist` 
          : 'Unable to added instrument to watchlist'
      });
      this.processing = false;
    },
    async removeFromWatchlist(watchlist_uuid) {
      this.processing = true
      const name = this.instrument.name;
      const res = await this.client.mutate({
        mutation: gql`mutation {
          removeFromWatchlist(instrument_uuid: "${this.instrument_uuid}", watchlist_uuid: "${watchlist_uuid}") {
            success
            message
          }
        }`,
        refetchQueries: [{
          query: gql`
            {
              me {
                uuid
                watchlistsConnection(uuid: "${watchlist_uuid}") {
                  edges {
                    node {
                      uuid
                      instruments {
                        uuid
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { repoName: 'apollographql/apollo-client' },
        }]
      });
      const success = res.data.removeFromWatchlist.success;
      this.showMessage({
        color: success 
          ? 'info' 
          : 'warning',
        text: success 
          ? `Instrument ${ name } removed from watchlist` 
          : 'Unable to remove instrument from watchlist'
      });
      this.processing = false;
    },
    ...mapActions('application', ['showMessage'])
  },
  data() {
    return {
      prosessing: false,
      watchQuery: `query {
        instruments(uuid: "${this.instrument_uuid}") {
          uuid
          name
        }
        me {
          uuid
          watchlistsConnection {
            edges {
              permission_mask
              node {
                uuid
                name
                instruments {
                  uuid
                }
              }
            }
          }
        }
      }`
    };
  }
};
</script>
