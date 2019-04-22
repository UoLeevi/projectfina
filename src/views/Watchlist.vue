<template>
  <InstrumentsTable :title="watchlist && watchlist.name"
    :watchlist_uuid="$route.params.watchlist_uuid" />
</template>

<script>
import GraphQLMixin from '@/mixins/GraphQLMixin';
import InstrumentsTable from '@/components/InstrumentsTable';

export default {
  mixins: [GraphQLMixin],
  components: {
    InstrumentsTable
  },
  computed: {
    watchlist() {
      return this.loading || this.error ? null : this.graph.me.watchlistsConnection.edges[0].node;
    }
  },
  data() {
    return {
      query: () => ` {
        me {
          watchlistsConnection(uuid: "${this.$route.params.watchlist_uuid}") {
            edges {
              node {
                uuid
                name
              }
            }
          }
        }
      }`
    };
  },
};
</script>
