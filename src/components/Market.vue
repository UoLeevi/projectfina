<template>
  <ul>
    <StockListItem
      v-for="(stock, symbol) in market.stocks"
      :key="symbol"
      :stock="stock"
      :symbol="symbol"
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
      return this.$store.state.marketData.markets[this.mic];
    }
  },
  created() {
    if (!this.market.stocks) this.fetchStocks({ mic: this.mic });
  }
};
</script>

<style scoped>
ul {
  width: 100%;
}
</style>
