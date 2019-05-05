<template>
  <v-container>
    <u-heading-row :heading="instrument && instrument.name" :breadcrumbs="breadcrumbs"/>
    <v-card>
    <InstrumentCard v-if="instrument" :instrument_uuid="instrument.uuid" />
    <v-flex xs12 xl6>
      <NotesCard v-if="graph.me && instrument" :instrument_uuid="instrument.uuid" />
    </v-flex>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import InstrumentCard from '@/components/InstrumentCard';
import NotesCard from '@/components/NotesCard';
import UHeadingRow from '@/components/UHeadingRow';
import GraphQLMixin from '@/mixins/GraphQLMixin';
import gql from 'graphql-tag';

export default {
  mixins: [GraphQLMixin],
  components: {
    InstrumentCard,
    NotesCard,
    UHeadingRow
  },
  computed: {
    market() {
      return this.loading
        ? null
        : this.graph.markets.find(
            market => market.mic === this.$route.params.mic
          );
    },
    instrument() {
      return this.market
        ? this.market.instruments.find(
            instrument => instrument.symbol === this.$route.params.symbol
          )
        : null;
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          href: `/markets/${this.$route.params.mic}`,
          text: this.$route.params.mic
        },
        {
          href: `/markets/${this.$route.params.mic}/instruments/${
            this.$route.params.symbol
          }`,
          text: this.$route.params.symbol,
          disabled: true
        }
      ],
      processing: false,
      watchQuery: {
        query: gql`query($mic: String!) {
          me {
            uuid
            name
          }
          markets(mic: $mic) {
            uuid
            mic
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
        }`,
        variables: {
          mic: this.$route.params.mic
        }
      }
    };
  }
};
</script>
