<template>
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
      <slot name="title">
        <h3 class="title grey--text text--darken-1">{{ title }}</h3>
      </slot>
    </template>
    <template #expand="props">
      <InstrumentCard v-if="props.item.uuid" :instrument_uuid="props.item.uuid" />
      <v-divider />
    </template>
  </u-data-table>
</template>

<script>
import GraphQLMixin from '@/mixins/GraphQLMixin';
import gql from 'graphql-tag';
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
          ? this.graph.markets
            .find(market => market.mic === this.market_mic)
            .instruments
          : this.graph.me.watchlistsConnection.edges
            .map(edge => edge.node)
            .find(watchlist => watchlist.uuid === this.watchlist_uuid)
            .instruments)
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
            date: new Date(instrument.eod_quotes[0].date),
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
            class: 'font-mono font-weight-bold ',
            component: {
              name: 'UDataTableFieldRouterLink',
              props: instrument => ({
                to: this.loading 
                  ? null 
                  : this.market_mic 
                    ? `/markets/${this.market_mic}/instruments/${instrument.symbol}`
                    : `/watchlists/${this.watchlist_uuid}/instruments/${instrument.uuid}`
              })
            }
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
      watchQuery: () => this.market_mic || this.watchlist_uuid
        ? this.market_mic 
          ? { 
            query: gql`query($market_mic: String){
              markets(mic: $market_mic) {
                uuid
                mic
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
            }`,
            variables: {
              market_mic: this.market_mic
            }
          }
          : {
            query: gql`query($watchlist_uuid: ID!) {
              me {
                uuid
                watchlistsConnection(uuid: $watchlist_uuid) {
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
            }`,
            variables: {
              watchlist_uuid: this.$route.params.watchlist_uuid
            }
          }
        : null
    };
  }
};
</script>
