<template>
  <ul>
    <StockListItem
      v-for="stock in stocks"
      :key="stock.symbol"
      :stock="stock"
      :symbol="stock.symbol"
    />
  </ul>
</template>

<script>
import { mapActions } from "vuex";
import StockListItem from "./StockListItem.vue";

export default {
  name: "Market",
  components: {
    StockListItem
  },
  methods: {
    ...mapActions("marketData", ["fetchStocks"])
  },
  computed: {
    mic() {
      return this.$route.params.mic;
    },
    market() {
      return this.mic && this.$store.state.marketData.markets[this.mic];
    },
    stocks() {
      return this.market && this.market.stocks && Object
        .keys(this.market.stocks)
        .sort()
        .map(symbol => ({ symbol, ...this.market.stocks[symbol] }));
    }
  },
  created() {
    if (this.market && !this.market.stocks) this.fetchStocks({ mic: this.mic });
  }
};
</script>

<style scoped>
ul {
  width: 100%;
}
</style>
