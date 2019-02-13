<template>
  <router-link :to="`/markets/${mic}/stocks/${symbol}`">
    <li>
      <div class="font-mono font-bold">{{ symbol }}</div>
      <div>{{ stock.name }}</div>
      <div class="font-mono font-bold" v-html="getPercentageChange(stock.current)"></div>
      <div class="font-mono">{{ stock.current && stock.current.currency }}</div>
      <div class="font-mono">
        {{ stock.current && stock.current.priceLast &&
        stock.current.priceLast.toLocaleString('en-US', { minimumFractionDigits: 2 })}}
      </div>
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
  methods: {
    getPercentageChange(stock) {
      if (!stock)
        return null;

      if (stock.quantity > 0)
      {
        const change = stock.priceLast / (stock.dateTime > stock.dateTimeClose ? stock.priceClose : stock.priceOpen) - 1;
        const cssClass = change > 0 ? 'color-pos' : change < 0 ? 'color-neg' : 'color-neutral';
        const changeString = (change > 0 ? '+' : '') + change.toLocaleString('en-US', { style: 'percent', minimumFractionDigits: 2 });
        return `<span class="${cssClass}">${changeString}</span>`;
      }
      else
        return '-';

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
  width: 180px;
  font-size: 0.85em;
}

li > div:nth-child(3) {
  width: 60px;
  text-align: right;
  padding-right: 30px;
}

li > div:nth-child(4) {
  width: 40px;
}

@media only screen and (max-width: 600px) {
  #app:not(.sidebar-collapsed) li > div:nth-child(2) {
    display: none;
  }
}
</style>
