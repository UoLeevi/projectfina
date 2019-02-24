<template>
  <div>
    <h2>
    {{ watchlist.name }}
    </h2>
    <h4>Watchlist</h4>
  </div>
</template>

<script>

export default {
  name: 'MarketHeading',
  components: {

  },
  computed: {
    watchlist() {
      return this.$store.state.user.watchlists[this.$route.params.uuid];
    }
  },
  data() {
    return {

    };
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
