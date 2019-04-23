<template>
  <InstrumentsTable :title="market && market.name"
    :market_mic="$route.params.mic" />
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
    market() {
      return this.loading ? null : this.graph.markets[0];
    }
  },
  data() {
    return {
      load: `{
        markets(mic: "${this.$route.params.mic}") {
          uuid
          name
        }
      }`
    };
  }
};
</script>
