<template>
  <div>
    <h2>{{ stock.name }}</h2>
    <h4>{{ symbol }}</h4>
  </div>
</template>

<script>
export default {
  name: "StockHeading",
  components: {},
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
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
</style>
