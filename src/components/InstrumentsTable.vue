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
        :no-data-text="loading 
          ? `Retrieving instrument data...` 
          : this.error
            ? this.error.message
            : 'No instrument data.'"
        item-key="uuid">
        <template #title>
          <h3 class="title grey--text text--darken-1">Instruments</h3>
        </template>
        <template #expand="props">
          <InstrumentCard v-if="props.item.uuid" :instrument_uuid="props.item.uuid" />
        </template>
      </u-data-table>
    </v-container>
  </div>
</template>

<script>
import GraphQLMixin from '@/mixins/GraphQLMixin';
import UDataTable from '@/components/UDataTable';
import InstrumentCard from '@/components/InstrumentCard';
import { timeTodayOrDateString, decimalString, percentString } from '@/utilities';

export default {
  mixins: [GraphQLMixin],
  components: {
    UDataTable,
    InstrumentCard
  },
  props: {
    title: String,
    market_mic: String,
    watchlist_uuid: String
  },
  computed: {
    instruments() {
      return (this.loading || this.error ? 
        [] 
        : this.market_mic
          ? this.graph.markets[0].instruments
          : this.graph.me.watchlistsConnection.edges[0].node.instruments)
    },
    items() {
      return (this.loading ? 
        [] 
        : this.instruments
          .map(instrument => ({
            uuid: instrument.uuid,
            symbol: instrument.symbol,
            name: instrument.name,
            priceLast: instrument.eod_quotes[0].price_close,
            changePercent: 
              100 * ((instrument.eod_quotes[0].price_close / instrument.eod_quotes[1].price_close) - 1),
            dateTime: new Date(instrument.eod_quotes[0].date),
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
            value: 'date',
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
      query: () => this.market_mic || this.watchlist_uuid
        ? this.market_mic 
          ? `{
              markets(mic: "${this.market_mic}") {
                uuid
                instruments {
                  uuid
                  name
                  symbol
                  sector
                  eod_quotes(last: 2) {
                    uuid
                    date
                    price_close
                  }
                }
              }
            }`
          : `{
              me {
                uuid
                watchlistsConnection(uuid: "${this.$route.params.watchlist_uuid}") {
                  edges {
                    node {
                      uuid
                      name
                      instruments {
                        uuid
                        name
                        symbol
                        sector
                        eod_quotes(last: 2) {
                          uuid
                          date
                          price_close
                        }
                      }
                    }
                  }
                }
              }
            }`
        : null
    };
  }
};
</script>
