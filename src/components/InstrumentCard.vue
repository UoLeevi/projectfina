<template>
  <v-card flat>
    <v-layout row wrap justify-center class="px-3 py-2">
      <v-flex xs12 sm6 lg4>
        <u-field label="Name" :value="instrument.name" />
        <u-field label="Sector" :value="instrument.sector" />
        <v-fade-transition>
          <v-layout column v-if="instrumentWatchlists || otherOwnedWatchlists">
            <span class="px-1 pt-1 font-weight-bold grey--text">Watchlists</span>
            <InstrumentWatchlistList :instrument_uuid="instrument.uuid" />
            <v-menu bottom right v-if="otherOwnedWatchlists">
              <template #activator="{ on }">
                <v-btn color="primary" flat small icon v-on="on">
                  <v-icon>add</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-tile
                  v-for="watchlist in otherOwnedWatchlists"
                  :key="watchlist.uuid"
                  @click="addInstrumentToWatchlist({ instrument_uuid: instrument.uuid, watchlist_uuid: watchlist.uuid})">
                  <v-list-tile-title>{{ watchlist.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-layout>
        </v-fade-transition>
      </v-flex>
      <v-spacer />
      <v-flex xs12 sm6 lg4 align-self-center class="py-1">
        <u-sparkline-card
          :loading="loading"
          :error="error"
          :labels="eodQuoteDates"
          :value="eodQuoteValues">
          <template #header="props">
            <h5 class="body-2 mx-auto text-no-wrap">
              <span class="body-2 font-weight-bold font-mono">{{ instrument.symbol }}</span>
              <span class="grey--text text--darken-1"> changed </span>
              <span :class="{ 'green--text': props.change > 0, 'red--text': props.change < 0 }"
                class="body-2 font-weight-bold font-mono">{{ percentString(props.changePercent) }}</span>
              <span class="grey--text text--darken-1"> from </span>
              <span class="body-2 font-weight-bold font-mono">{{ props.first.label }}</span>
              <span class="grey--text text--darken-1"> to </span>
              <span class="body-2 font-weight-bold font-mono">{{ props.last.label }}</span>
              <span class="grey--text text--darken-1">.</span>
            </h5>
          </template>
          <template #footer="props">
            <v-layout row class="px-4" justify-space-around>
              <u-field :sublabel="props.first.label" :value="decimalString(props.first.value)" center />
              <u-field label="Min" :sublabel="props.min.label" :value="decimalString(props.min.value)" center />
              <u-field label="Max" :sublabel="props.max.label" :value="decimalString(props.max.value)" center />
              <u-field :sublabel="props.last.label" :value="decimalString(props.last.value)" center />
            </v-layout>
          </template>
        </u-sparkline-card>
      </v-flex>
    </v-layout>
    <v-divider/>
  </v-card>
</template>

<script>
import InstrumentWatchlistList from '@/components/InstrumentWatchlistList';
import USparklineCard from '@/components/USparklineCard';
import UField from '@/components/UField';
import { mapState } from 'vuex';
import LoadMixin from '@/mixins/LoadMixin'
import { Uo, decimalString, percentString } from '@/utilities';

export default {
  mixins: [LoadMixin],
  props: {
    instrument_uuid: String
  },
  components: {
    UField,
    USparklineCard,
    InstrumentWatchlistList
  },
  computed: {
    ...mapState('domain', {
      instrument(state) { 
        return (state.instruments || {})[this.instrument_uuid] || {}
      },
      watchlists: state => state.watchlists
    }),
    instrumentWatchlists() {
      return Object.values(this.watchlists || {})
        .filter(watchlist => watchlist.instruments && watchlist.instruments[this.instrument.uuid]);
    },
    otherOwnedWatchlists() {
      return Object.values(this.watchlists || {})
        .filter(watchlist => watchlist.user_is_owner && watchlist.instruments && !watchlist.instruments[this.instrument.uuid]);
    },
    eodQuotes() {
      return !this.loading && this.instrument.quotes && this.instrument.quotes.eod
        ? Object.values(this.instrument.quotes.eod)
          .reduce((a, y) => Object.assign(a, y), {})
        : {};
    },
    eodQuoteDates() {
      return Object.keys(this.eodQuotes)
        .sort()
        .slice(-250);
    },
    eodQuoteValues() {
      return this.eodQuoteDates.map(price.bind(this));
      function price(_, i) {
        if (i < 0)
          return null;
        const priceClose = this.eodQuotes[this.eodQuoteDates[i]].priceClose;
        return (typeof priceClose === 'number' ? priceClose : price.call(this, _, i - 1));
      }
    }
  },
  methods: {
    scaleNumbers: Uo.math.scale,
    decimalString,
    percentString
  },
  data() {
    return {
      dependencies: [
        {
          watchlists: {
            instruments: null
          },
          instruments: {
            [this.instrument_uuid]: {
              quotes: {
                current: null,
                eod: {
                  [`${new Date().getFullYear()}`]: null
                }
              }
            }
          }
        },
        () => Object.keys(this.watchlists || {})
          .reduce((d, watchlist_uuid) => { 
              d.watchlists[watchlist_uuid] = { instruments: null };
              return d;
            }, { watchlists: {} })
      ]
    };
  }
};
</script>

