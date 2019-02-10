<template>
  <div>
    <ul>
      <li>
        <div class="font-bold label">Sector</div>
        <div class="font-mono">{{ stock && stock.sector }}</div>
      </li>
    </ul>
  </div>
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
      return this.market.stocks ? this.market.stocks[this.symbol] : null;
    },
    quotes() {
      return this.$store.state.marketData.quotes.eod.map(
        quotesForMarket => quotesForMarket[this.mic][this.symbol]
      );
    }
  },
  created() {
    let year = new Date().getUTCFullYear();
    if (!this.market.stocks)
      this.fetchStocks({ mic: this.mic }).then(() =>
        this.fetchQuotes({ mic: this.mic, symbol: this.symbol, year })
      );
    else if (!this.getQuotes(year))
      this.fetchQuotes({ mic: this.mic, symbol: this.symbol, year });
  }
};
</script>

<style scoped>
.label {
  font-weight: 400;
  color: #bbb;
  line-height: 24px;
  font-size: 0.9em;
}

li {
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}
</style>
