<template>
  <div class="instrument-info">
    <div class="instrument-price-box">
      <div
        class="instrument-change font-bold font-mono"
        :class="{'color-pos': changePercent > 0, 'color-neg': changePercent < 0}"
      >{{ changePercentString }}</div>
      <div class="instrument-price font-bold font-mono">{{ priceLastString }}</div>
      <div class="instrument-datetime font-mono">{{ priceUpdated }}</div>
    </div>
    <div class="chart-container">
      <canvas id="eodChart"></canvas>
    </div>
    <div class="notes-box" v-if="user.jwt">
      <form id="notes-form" @submit.prevent="createNoteForInstrument">
        <label for="instrument-notes">Notes</label>
        <textarea
          id="instrument-notes"
          name="instrument-notes"
          class="font-mono"
          rows="6"
          spellcheck="false"
          v-model="note.body"
        ></textarea>
        <button :disabled="!note.body">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Chart from "chart.js";

export default {
  name: "Instrument",
  data() {
    return {
      note: {
        uuid: null,
        body: ""
      }
    };
  },
  components: {},
  methods: {
    ...mapActions("markets", ["fetchEodQuotes"]),
    ...mapActions("user", ["createNote", "addNoteToInstrument"]),
    async createNoteForInstrument() {
      await this.createNote(this.note);
      const note_uuid = this.note.uuid;
      const instrument_uuid = this.instrument.uuid;
      this.note.uuid = null;
      this.note.body = "";
      await this.addNoteToInstrument({ note_uuid, instrument_uuid });
    }
  },
  computed: {
    ...mapState(["user"]),
    ...mapGetters("markets", ["getEodQuotes"]),
    symbol() {
      return this.$route.params.symbol;
    },
    instrument() {
      return this.$store.state.markets.selection.instrument;
    },
    currentQuotes() {
      return this.instrument && this.instrument.quotes
        ? this.instrument.quotes.current
        : null;
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
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date
        .getDate()
        .toString()
        .padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }
  },
  async created() {
    await this.fetchEodQuotes({
      mic: this.$route.params.mic,
      symbol: this.$route.params.symbol
    });
    let quotes = this.getEodQuotes(this.instrument.market_mic, this.symbol);
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
};
</script>

<style scoped>
.instrument-info {
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.instrument-price-box {
  display: flex;
  flex-direction: column;
  padding: 8px 32px 32px 16px;
  white-space: nowrap;
}

.instrument-price-box .instrument-change {
  font-size: 1.4em;
}

.instrument-price-box .instrument-price {
  font-size: 3em;
  color: #666666;
}

.instrument-price-box .instrument-datetime {
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

.notes-box {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#notes-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

#notes-form button {
  margin-top: 10px;
  width: 40px;
}

textarea {
  resize: vertical;
  overflow: auto;
  outline: none;
  box-shadow: none;
  padding: 8px;
  line-height: 1.3em;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 4px;
}

@media only screen and (max-width: 700px) {
  #app:not(.sidebar-collapsed) .chart-container {
    display: none;
  }
}
</style>
