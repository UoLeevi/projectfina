<template>
  <v-card flat v-if="instrument">
    <v-layout row wrap justify-start class="px-3 py-2">
      <v-flex xs12 sm6 lg4 class="pb-2">
        <u-field label="Name" :value="instrument.name" />
        <u-field label="Sector" :value="instrument.sector" />
        <v-divider/>
      </v-flex>
      <v-flex xs12 sm6 lg4 class="pb-2">
        <v-fade-transition>
          <v-layout column v-if="graph.me">
            <span class="px-1 pt-1 font-weight-bold grey--text">Watchlists</span>
            <InstrumentWatchlistList :instrument_uuid="instrument.uuid" />
            <v-divider/>
          </v-layout>
        </v-fade-transition>
      </v-flex>
      <v-flex xs12 sm6 lg4 align-self-center class="py-1">
        <u-sparkline-card
          :loading="loading"
          :error="error"
          :labels="instrument.eod_quotes.slice().reverse().map(e => dateString(e.date))"
          :value="instrument.eod_quotes.slice().reverse().map(e => e.price_close)">
          <template #header="props">
            <h5 class="body-2 mx-auto text-no-wrap">
              <span class="body-2 font-weight-bold font-mono">{{ instrument.symbol }}</span>
              <span class="grey--text text--darken-1"> changed </span>
              <span :class="{ 'green--text text--darken-1': props.change > 0, 'red--text text--darken-2': props.change < 0 }"
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
        <v-divider/>
      </v-flex>
    </v-layout>
    <v-divider/>
  </v-card>
</template>

<script>
import InstrumentWatchlistList from '@/components/InstrumentWatchlistList';
import USparklineCard from '@/components/USparklineCard';
import UField from '@/components/UField';
import GraphQLMixin from '@/mixins/GraphQLMixin';
import { Uo, dateString, decimalString, percentString } from '@/utilities';

export default {
  mixins: [GraphQLMixin],
  props: {
    instrument_uuid: String
  },
  components: {
    UField,
    USparklineCard,
    InstrumentWatchlistList
  },
  computed: {
    instrument() {
      return this.loading ? null : this.graph.instruments[0]
    }
  },
  methods: {
    scaleNumbers: Uo.math.scale,
    dateString,
    decimalString,
    percentString
  },
  data() {
    return {
      watchQuery: () => `{
        me {
          uuid
        }
        instruments(uuid: "${this.instrument_uuid}") {
          uuid
          symbol
          name
          sector
          eod_quotes(last: 250) {
            uuid
            date
            price_low
            price_high
            price_close
          }
        }
      }`
    };
  }
};
</script>

