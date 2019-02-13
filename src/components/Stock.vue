<template>
  <div class="stock-info">
    <div class="stock-price-box">
      <div class="stock-change font-bold font-mono" v-html="getPercentageChange(stock.current)"></div>
      <div class="stock-price font-bold font-mono">{{ stock && stock.current.priceLast }}</div>
      <div class="stock-datetime font-mono">{{ stock && stock.current.dateTime }}</div>
    </div>
    <div class="chart-container">
      <canvas id="eodChart"></canvas>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Chart from "chart.js";

export default {
  name: "Stock",
  components: {},
  methods: {
    ...mapActions("marketData", ["fetchStocks", "fetchQuotes"]),
    getPercentageChange(stock) {
      if (!stock) return null;

      if (stock.quantity > 0) {
        const change =
          stock.priceLast /
            (stock.dateTime > stock.dateTimeClose
              ? stock.priceClose
              : stock.priceOpen) -
          1;
        const cssClass =
          change > 0 ? "color-pos" : change < 0 ? "color-neg" : "color-neutral";
        const changeString =
          (change > 0 ? "+" : "") +
          change.toLocaleString("en-US", {
            style: "percent",
            minimumFractionDigits: 2
          });
        return `<span class="${cssClass}">${changeString}</span>`;
      } else return "-";
    }
  },
  computed: {
    mic() {
      return this.$route.params.mic;
    },
    market() {
      return this.$store.state.marketData.markets[this.mic];
    },
    symbol() {
      return this.$route.params.symbol;
    },
    stock() {
      return this.market.stocks ? this.market.stocks[this.symbol] : null;
    },
    quotesByYear() {
      let quotesByYearForMarket = this.$store.state.marketData.quotes.eod[
        this.mic
      ];
      return quotesByYearForMarket && quotesByYearForMarket[this.symbol];
    }
  },
  created() {
    if (!this.market || !this.market.stocks)
      this.fetchStocks({ mic: this.mic })
        .then(() => this.fetchQuotes({ mic: this.mic, symbol: this.symbol }))
        .then(createEodChart.bind(this));
    else if (!this.quotesByYear)
      this.fetchQuotes({ mic: this.mic, symbol: this.symbol }).then(
        createEodChart.bind(this)
      );
    else createEodChart.call(this);

    function createEodChart() {
      let quotes = Object.values(this.quotesByYear).reduce(
        (r, quotesForOneYear) => Object.assign(r, quotesForOneYear),
        {}
      );
      let dates = Object.keys(quotes)
        .sort()
        .slice(-250);
      new Chart(document.getElementById("eodChart"), {
        type: "bar",
        data: {
          labels: dates,
          datasets: [
            {
              type: "line",
              label: "Close price",
              yAxisID: "Price",
              data: dates.map(date => quotes[date].priceClose),
              pointBackgroundColor: "rgba(0, 0, 0, 0)",
              pointBorderColor: "rgba(0, 0, 0, 0)"
            },
            {
              label: "Quantity",
              yAxisID: "Quantity",
              data: dates.map(date => quotes[date].quantity),
              backgroundColor: "#ddd"
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: "#f5f5f5",
                  thickness: 1
                },
                ticks: {
                  autoSkip: true,
                  maxRotation: 90,
                  minRotation: 90,
                  maxTicksLimit: 29,
                  barThickness: 3
                }
              }
            ],
            yAxes: [
              {
                id: "Price",
                type: "linear",
                position: "left",
                gridLines: {
                  color: "#f5f5f5",
                  thickness: 1
                }
              },
              {
                id: "Quantity",
                type: "linear",
                position: "right",
                beginAtZero: true,
                gridLines: false
              }
            ]
          },
          layout: {
            padding: {
              right: 10
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.stock-info {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.stock-price-box {
  display: flex;
  flex-direction: column;
  padding: 8px 32px 32px 16px;
  white-space: nowrap;
}

.stock-price-box  .stock-change {
  font-size: 1.4em;
}

.stock-price-box .stock-price {
  font-size: 3em;
  color: #666666;
}

.stock-price-box .stock-datetime {
  font-size: 0.9em;
}

.label {
  font-weight: 400;
  color: #bbb;
  line-height: 24px;
  font-size: 0.9em;
}

.chart-container {
  position: relative;
  margin: 18px;
  width: 100%;
  max-width: 1120px;
  height: auto;
}

@media only screen and (max-width: 700px) {
  #app:not(.sidebar-collapsed) .chart-container {
    display: none;
  }
}
</style>
