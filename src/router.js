import Vue from 'vue'
import Router from 'vue-router'
import Market from './components/Market.vue';
import MarketHeading from './components/MarketHeading.vue';
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
        path: '/watchlists/:uuid',
        name: 'watchlists',
        components: {
          default: Watchlist,
          heading: WatchlistHeading
        }
      }
  ]
});
