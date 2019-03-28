<template>
  <router-link :to="`/markets/${mic}/instruments/${symbol}`">
    <li>
      <div class="font-mono font-bold">{{ symbol }}</div>
      <div>{{ instrument.name }}</div>
      <div
        class="font-mono font-bold"
        :class="{'color-pos': changePercent > 0, 'color-neg': changePercent < 0}"
      >{{ changePercentString }}</div>
      <div class="font-mono">{{ instrument.currency }}</div>
      <div class="font-mono font-bold">{{ priceLastString }}</div>
      <div class="font-mono">{{ priceUpdated }}</div>
    </li>
  </router-link>
</template>

<script>
export default {
  name: "InstrumentListItem",
  computed: {
    mic() {
      return this.$route.params.mic;
    },
    currentQuotes() {
      return this.instrument.quotes ? this.instrument.quotes.current : null;
    },
    changePercent() {
      return this.currentQuotes && this.currentQuotes.changePercent;
    },
    changePercentString() {
      return isNaN(parseFloat(this.changePercent))
        ? "N/A"
        : this.changePercent.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) + "%";
    },
    priceLast() {
      return this.currentQuotes && this.currentQuotes.priceLast;
    },
    priceLastString() {
      return (
        this.priceLast &&
        this.priceLast.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3
        })
      );
    },
    priceUpdated() {
      if (!this.currentQuotes) return null;
      const date = new Date(
        this.currentQuotes.dateTimeClose > this.currentQuotes.dateTime
          ? this.currentQuotes.dateTimeClose
          : this.currentQuotes.dateTime
      );
      return date.toDateString() == new Date().toDateString()
        ? `${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        : `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")}`;
    }
  },
  props: {
    symbol: String,
    instrument: Object
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
  padding-right: 10px;
}

li > div:nth-child(4) {
  width: 40px;
  text-align: right;
}

li > div:nth-child(5) {
  width: 54px;
  text-align: right;
  padding-left: 6px;
  padding-right: 10px;
}

li > div:nth-child(6) {
  width: 85px;
  text-align: right;
}

@media only screen and (max-width: 600px) {
  #app:not(.sidebar-collapsed) li > div:nth-child(2) {
    display: none;
  }
}
</style>
