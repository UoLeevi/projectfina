<template>
  <div>
    <h2>{{ market && market.name }}</h2>
    <h4>{{ mic }}</h4>
  </div>
</template>

<script>
export default {
  name: "MarketHeading",
  computed: {
    mic() {
      return this.$store.state.markets.selection.mic;
    },
    market() {
      return this.$store.state.markets.selection.market;
    }
  }
};
</script>

<style scoped>
</style>
