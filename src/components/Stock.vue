<template>
  <div></div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Stock",
  components: {},
  methods: {
    ...mapActions("marketData", ["fetchStocks", "fetchQuotes"]),
    getQuotes(year) {
      let quotesForYear = this.$store.state.marketData.quotes.eod[year];
      if (!quotesForYear) return null;
      let quotesForMarket = quotesForYear[this.mic];
      if (!quotesForMarket) return null;
      let quotesForSymbol = quotesForMarket[this.symbol];
      return quotesForSymbol;
    }
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
      return this.$store.state.marketData.markets[this.mic].stocks[this.symbol];
    },
    quotes() {
      return this.$store.state.marketData.quotes.eod.map(
        (quotesForMarket) => quotesForMarket[this.mic][this.symbol]);
    }
  },
  created() {
    if (!this.market.stocks) this.fetchStocks({ mic: this.mic });
    let year = new Date().getUTCFullYear();
    if (!this.getQuotes(year))
      this.fetchQuotes({ mic: this.mic, symbol: this.symbol, years: [year] });
  }
};
</script>

<style scoped>
</style>
