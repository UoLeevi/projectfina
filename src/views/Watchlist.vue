<template>
  <InstrumentsTable :title="watchlist.name"
    :instrument_uuids="Object.keys(watchlist && watchlist.instruments || {})" />
</template>

<script>
import { mapState } from 'vuex';
import LoadMixin from '@/mixins/LoadMixin';
import InstrumentsTable from '@/components/InstrumentsTable';

export default {
  mixins: [LoadMixin],
  components: {
    InstrumentsTable
  },
  computed: {
    watchlist_uuid() {
      return this.$route.params.watchlist_uuid;
    },
    ...mapState('domain', {
      watchlist(state) {
        return (state.watchlists || {})[this.watchlist_uuid] || {};
      },
    })
  },
  data() {
    return {
      dependencies: [
        {
          watchlists: null
        },
        () => ({
          watchlists: {
            [this.watchlist_uuid]: {
              instruments: null
            }
          }
        })
      ]
    };
  },
};
</script>
