import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Market from './views/Market'
import MarketInstrument from './views/MarketInstrument'
import Watchlist from './views/Watchlist'
import WatchlistInstrument from './views/WatchlistInstrument'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/markets/:mic',
      name: 'market',
      component: Market
    },
    {
      path: '/markets/:mic/instruments/:symbol',
      name: 'market/instrument',
      component: MarketInstrument
    },
    {
      path: '/watchlists/:watchlist_uuid',
      name: 'watchlist',
      component: Watchlist
    },
    {
      path: '/watchlists/:watchlist_uuid/instruments/:instrument_uuid',
      name: 'watchlist/instrument',
      component: WatchlistInstrument
    },
  ]
})
