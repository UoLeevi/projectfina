<template>
  <v-container>
    <InstrumentsTable :title="watchlist && watchlist.name"
      :watchlist_uuid="$route.params.watchlist_uuid" />
    <v-layout>
    <v-spacer/>
      <v-fade-transition>
        <v-btn v-show="watchlist && canDelete" 
          class="mt-4" 
          flat @click="deleteWatchlist" 
          :loading="processing">
          <span>Delete watchlist</span>
        </v-btn>
      </v-fade-transition>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import GraphQLMixin from '@/mixins/GraphQLMixin';
import gql from 'graphql-tag';
import InstrumentsTable from '@/components/InstrumentsTable';

export default {
  mixins: [GraphQLMixin],
  components: {
    InstrumentsTable
  },
  computed: {
    watchlist() {
      return this.loading || this.error ? null : this.graph.me.watchlistsConnection.edges
        .map(edge => edge.node)
        .find(watchlist => watchlist.uuid === this.$route.params.watchlist_uuid);
    },
    canDelete() {
      return !this.loading && !this.error && (parseInt(this.graph.me.watchlistsConnection.edges
        .find(edge => edge.node.uuid === this.$route.params.watchlist_uuid)
        .permission_mask + '', 2) & 0b00010000) !== 0;
    }
  },
  methods: {
    async deleteWatchlist() {
      this.processing = true
      const name = this.watchlist.name;
      const res = await this.client.mutate({
        mutation: gql`mutation {
          deleteWatchlist(watchlist_uuid: "${this.$route.params.watchlist_uuid}") {
            success
            message
          }
        }`,
        refetchQueries: [{
          query: gql` {
            me {
              uuid
              watchlistsConnection {
                edges {
                  node {
                    uuid
                  }
                }
              }
            }
          }`
        }]
      });
      const success = res.data.deleteWatchlist.success;
      this.showMessage({
        color: success ? 'info' : 'warning',
        text: success ? `Watchlist ${ name } deleted` : 'Unable to delete watchlist'
      });
      this.processing = false;
      this.$router.push({ path: '/' });
    },
    ...mapActions('application', ['showMessage'])
  },
  data() {
    return {
      processing: false,
      watchQuery: {
        query: gql`query($watchlist_uuid: ID!) {
          me {
            uuid
            watchlistsConnection(uuid: $watchlist_uuid) {
              edges {
                permission_mask
                node {
                  uuid
                  name
                }
              }
            }
          }
        }`,
        variables: {
          watchlist_uuid: this.$route.params.watchlist_uuid
        }
      }
    };
  }
};
</script>
