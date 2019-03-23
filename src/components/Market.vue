<template>
  <ul>
    <InstrumentListItem
      v-for="instrument in instruments"
      :key="instrument.symbol"
      :instrument="instrument"
      :symbol="instrument.symbol"
    />
  </ul>
</template>

<script>
import { mapActions } from "vuex";
import InstrumentListItem from "./InstrumentListItem.vue";

export default {
  name: "Market",
  components: {
    InstrumentListItem
  },
  methods: {
    ...mapActions("markets", ["fetchInstruments"])
  },
  computed: {
    market() {
      return this.$store.state.markets.selection.market;
    },
    instruments() {
      return this.market 
        && this.market.instruments
        && Object
          .keys(this.market.instruments)
          .sort()
          .map(symbol => ({ symbol, ...this.market.instruments[symbol] }));
    }
  },
  created() {

  }
};
</script>

<style scoped>
ul {
  width: 100%;
}
</style>
