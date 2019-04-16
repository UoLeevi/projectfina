<template>
  <InstrumentsTable :title="market.name"
    :instrument_uuids="Object.keys(market && market.instruments || {})" />
</template>

<script>
import LoadMixin from '@/mixins/LoadMixin';
import InstrumentsTable from '@/components/InstrumentsTable';

export default {
  mixins: [LoadMixin],
  components: {
    InstrumentsTable
  },
  computed: {
    mic() {
      return this.$route.params.mic;
    },
    market() {
      return this.$store.getters['domain/getMarketByMic'](this.mic) || {};
    }
  },
  data() {
    return {
      dependencies: [
        {
          instruments: null,
          markets: null
        }
      ]
    };
  }
};
</script>
