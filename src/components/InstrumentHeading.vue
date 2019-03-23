<template>
  <div>
    <h2>{{ instrument && instrument.name }}</h2>
    <h4>{{ symbol }}</h4>
  </div>
</template>

<script>

export default {
  name: "InstrumentHeading",
  components: {},
  computed: {
    symbol() {
      return this.$route.params.symbol;
    },
    instrument() {
      return this.$store.state.markets.selection.instrument;
    }
  }
};
</script>

<style scoped>
</style>
