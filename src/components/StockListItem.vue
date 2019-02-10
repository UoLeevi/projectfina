<template>
  <router-link :to="`/markets/${mic}/stocks/${symbol}`">
    <li>
      <div class="font-mono font-bold">{{ symbol }}</div>
      <div>{{ stock.name }}</div>
      <div></div>
    </li>
  </router-link>
</template>

<script>
export default {
  name: "StockListItem",
  computed: {
    mic() {
      return this.$route.params.mic;
    }
  },
  props: {
    symbol: String,
    stock: Object
  }
};
</script>

<style scoped>
a {
  display: block;
  width: 100%;
  height: 100%;
  font-weight: 400;
  color: #666666;
  text-decoration: none;
}

li {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.14);
  font-size: 0.9em;
  white-space: nowrap;
}

li:hover {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  color: #000;
}

li > div:nth-child(1) {
  width: 62px;
}

li > div:nth-child(2) {
  width: 200px;
  font-size: 0.85em;
}

@media only screen and (max-width: 600px) {
  #app:not(.sidebar-collapsed) li > div:nth-child(2) {
    display: none;
  }
}
</style>
