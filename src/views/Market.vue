<template>
  <v-container>
    <InstrumentsTable :title="market && market.name"
      :market_mic="$route.params.mic" />
  </v-container>
</template>

<script>
import GraphQLMixin from '@/mixins/GraphQLMixin';
import gql from 'graphql-tag';
import InstrumentsTable from '@/components/InstrumentsTable';

export default {
  mixins: [GraphQLMixin],
  components: {
    InstrumentsTable
  },
  computed: {
    market() {
      return this.loading ? null : this.graph.markets
        .find(market => market.mic === this.$route.params.mic);
    }
  },
  data() {
    return {
      watchQuery: { 
        query: gql`query ($mic: String!){
          markets(mic: $mic) {
            uuid
            mic
            name
          }
        }`,
        variables: {
          mic: this.$route.params.mic
        }
      }
    };
  }
};
</script>
