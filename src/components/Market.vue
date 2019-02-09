<template>
  <div>
    <ul>
      <li v-for="symbol in market.instruments" :key="symbol">{{ symbol }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Market",
  components: {},
  computed: {
    market() {
      return this.$store.state.marketData.markets[this.$route.params.mic];
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
