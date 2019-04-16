<template>
  <v-list dense>
    <v-list-tile
      v-for="(watchlist, watchlist_uuid) in instrumentWatchlists"
      :key="watchlist_uuid"
      :to="`/watchlists/${watchlist_uuid}`"
      exact>
      <v-list-tile-title>
        <span class="px-1 pb-1 font-weight-bold body-2 grey--text text--darken-3 font-mono">{{watchlist.name}}</span>
        <v-btn v-if="watchlist.user_is_owner" color="red" flat small icon 
          @click="removeInstrumentFromWatchlist({ instrument_uuid, watchlist_uuid })"><v-icon>remove</v-icon></v-btn>
      </v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LoadMixin from '@/mixins/LoadMixin';

export default {
  mixins: [LoadMixin],
  props: {
    instrument_uuid: String
  },
  computed: {
    ...mapState('domain', ['instruments', 'watchlists']),
    instrument() {
      return this.instruments[this.instrument_uuid];
    },
    instrumentWatchlists() {
      return Object.values(this.watchlists || {})
        .filter(watchlist => watchlist.instruments && watchlist.instruments[this.instrument_uuid]);
    },
    otherOwnedWatchlists() {
      return Object.values(this.watchlists || {})
        .filter(watchlist => watchlist.user_is_owner && watchlist.instruments && !watchlist.instruments[this.instrument_uuid]);
    },
  },
  methods: {
    ...mapActions('domain', ['addInstrumentToWatchlist', 'removeInstrumentFromWatchlist'])
  },
  data() {
    return {
      dependencies: [
        {
          watchlists: null,
          instruments: {
            [this.instrument_uuid]: {
              quotes: {
                current: null,
                eod: {
                  [`${new Date().getFullYear() - 1}`]: null,
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
