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
      return this.$store.state.user.watchlists[this.$route.params.uuid];
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
