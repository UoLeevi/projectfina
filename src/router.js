import Vue from 'vue'
import Router from 'vue-router'
import Market from './components/Market.vue';
import MarketHeading from './components/MarketHeading.vue';
import Instrument from './components/Instrument.vue';
import InstrumentHeading from './components/InstrumentHeading.vue';
import Watchlist from './components/Watchlist.vue';
import WatchlistHeading from './components/WatchlistHeading.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/markets/:mic',
      name: 'market',
      components: {
        default: Market,
        heading: MarketHeading
      }
    },
    {
      path: '/markets/:mic/instruments/:symbol',
      name: 'instrument',
      components: {
        default: Instrument,
        heading: InstrumentHeading
      }
    },
    {
        path: '/watchlists/:uuid',
        name: 'watchlist',
        components: {
          default: Watchlist,
          heading: WatchlistHeading
        }
      }
  ]
});
