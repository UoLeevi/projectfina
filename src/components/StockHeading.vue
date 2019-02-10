<template>
  <div>
    <h2>{{ stock && stock.name }}</h2>
    <h4>{{ symbol }}</h4>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "StockHeading",
  components: {},
  methods: {
    ...mapActions("marketData", ["fetchStocks"])
  },
  computed: {
    mic() {
      return this.$route.params.mic;
    },
    market() {
      return this.$store.state.marketData.markets[this.mic];
    },
    symbol() {
      return this.$route.params.symbol;
    },
    stock() {
      return this.market.stocks ? this.market.stocks[this.symbol] : null;
    }
  },
  created() {
    if (!this.market.stocks) this.fetchStocks({ mic: this.mic });
  }
};
</script>

<style scoped>
</style>
