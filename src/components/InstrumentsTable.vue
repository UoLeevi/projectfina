<template>
  <div>
    <slot name="title">
      <h1 class="mx-4 my-3 grey--text text--darken-2 headline">{{ title }}</h1>
    </slot>
    <v-container class="my-4">
      <u-data-table 
        :columns.sync="columns"
        :pagination.sync="pagination"
        :loading="loading"
        :expand="true"
        :items="items"
        :no-data-text="loading ? `Retrieving instrument data...` : 'No instrument data.'"
        item-key="uuid">
        <template #title>
          <h3 class="title grey--text text--darken-1">Instruments</h3>
        </template>
        <template #expand="props">
          <InstrumentCard :instrument_uuid="props.item.uuid" />
        </template>
      </u-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoadMixin from '@/mixins/LoadMixin'
import UDataTable from '@/components/UDataTable';
import InstrumentCard from '@/components/InstrumentCard';
import { timeTodayOrDateString, decimalString, percentString } from '@/utilities';

export default {
  mixins: [LoadMixin],
  components: {
    UDataTable,
    InstrumentCard
  },
  props: {
    title: String,
    instrument_uuids: {
      type: [Array, Function],
      default: () => []
    }
  },
  computed: {
    ...mapState('domain', [
      'instruments',
      'markets'
    ]),
    items() {
      return (this.loading ? 
        [] 
        : this.instrument_uuids
          .map(instrument_uuid => this.instruments[instrument_uuid])
          .map(instrument => ({
            uuid: instrument.uuid,
            symbol: instrument.symbol,
            name: instrument.name,
            priceLast: instrument.quotes && instrument.quotes.current.priceLast,
            changePercent: instrument.quotes && instrument.quotes.current.changePercent,
            dateTime: instrument.quotes && instrument.quotes.current.dateTime,
            sector: instrument.sector
          })));
    }
  },
  methods: {
    timeTodayOrDateString, 
    decimalString, 
    percentString,
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    }
  },
  data() {
    return {
      search: '',
      columns: [
        {
          show: true,
          header: {
            text: 'Symbol',
            align: 'left',
            sortable: true,
            value: 'symbol',
          },
          field: {
            align: 'left',
            class: 'font-mono font-weight-bold '
          }
        },
        {
          show: true,
          media: 'smAndUp',
          header: {
            text: 'Name',
            align: 'left',
            sortable: true,
            value: 'name',
            width: '210px'
            },
          field: {
            align: 'left'
          }
        },
        {
          show: true,
          header: {
            text: 'Last price',
            align: 'right',
            sortable: true,
            value: 'priceLast',
          },
          field: {
            align: 'right',
            format: decimalString,
            class: 'font-mono font-weight-bold '
          }
        },
        {
          show: true,
          header: {
            text: 'Change',
            align: 'right',
            sortable: true,
            value: 'changePercent',
          },
          field: {
            align: 'right',
            format: percentString,
            class: value => 'font-mono font-weight-bold ' + (value > 0.0 
              ? 'green--text text--darken-1' 
              : value < 0.0
                ? 'red--text text--darken-2'
                : '')
          }
        },
        {
          show: true,
          media: 'lgAndUp',
          header: {
            text: 'Updated',
            align: 'right',
            sortable: true,
            value: 'dateTime',
          },
          field: {
            align: 'right',
            format: timeTodayOrDateString
          }
        },
        {
          show: true,
          media: 'xl',
          header: {
            text: 'Sector',
            align: 'left',
            sortable: true,
            value: 'sector'
            },
          field: {
            align: 'left'
          }
        }
      ],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: -1, // -1 for All
        sortBy: 'symbol',
        totalItems: this.items ? this.items.length : 0
      },
      dependencies: [
        {
          instruments: null,
          markets: null
        },
        () => [...new Set(this.instrument_uuids
            .map(instrument_uuid => this.instruments[instrument_uuid].market_uuid))]
          .reduce((dependencies, market_uuid) => {
            dependencies.markets[market_uuid] = { 
              quotesUpdated: null 
            };
            return dependencies;
          }, { markets: {} })
      ]
    };
  }
};
</script>
