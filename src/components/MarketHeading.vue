<template>
  <div>
    <h2>{{ market.name }}</h2>
    <h4>{{ mic }}</h4>
  </div>
</template>

<script>
export default {
  name: "MarketHeading",
  computed: {
    mic() {
      return this.$route.params.mic;
    },
    market() {
      return this.mic && this.$store.state.marketData.markets[this.mic];
    }
  }
};
</script>

<style scoped>
</style>
