<template>
  <div>
    {{ watchlist.name }}
  </div>
</template>

<script>
export default {
  name: "Watchlist",
  components: {},
  computed: {
    watchlist() {
      return this.$store.state.investments.watchlists.find(watchlist => watchlist.uuid == this.$route.params.uuid );
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
