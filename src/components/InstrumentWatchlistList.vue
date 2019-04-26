<template>
  <v-list dense v-if="!loading">
    <v-list-tile
      v-for="watchlist in graph.me.watchlists
        .filter(watchlist => watchlist.instruments
          .map(i => i.uuid)
          .includes(instrument_uuid))"
      :key="watchlist.uuid"
      :to="`/watchlists/${watchlist.uuid}`"
      exact>
      <v-list-tile-title>
        <span class="px-1 pb-1 font-weight-bold body-2 grey--text text--darken-3 font-mono">{{ watchlist.name }}</span>
        <v-btn v-if="watchlist.user_is_owner" color="red" flat small icon 
          @click="removeInstrumentFromWatchlist({ instrument_uuid, watchlist_uuid: watchlist.uuid })">
          <v-icon>remove</v-icon>
        </v-btn>
      </v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>

<script>
import { mapActions } from 'vuex';
import GraphQLMixin from '@/mixins/GraphQLMixin';

export default {
  mixins: [GraphQLMixin],
  props: {
    instrument_uuid: String
  },
  computed: {
    instrument() {
      return this.loading ? null : this.graph.me.instruments[0];
    }
  },
  methods: {
    ...mapActions('domain', ['addInstrumentToWatchlist', 'removeInstrumentFromWatchlist'])
  },
  data() {
    return {
      watchQuery: `{
        instruments(uuid: "${this.instrument_uuid}") {
          uuid
          name
        }
        me {
          watchlists {
            uuid
            name
            instruments {
              uuid
            }
          }
        }
      }`
    };
  }
};
</script>
