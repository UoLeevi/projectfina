import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Market from './views/Market'
import Instrument from './views/Instrument'
import Watchlist from './views/Watchlist'

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
      name: 'instrument',
      component: Instrument
    },
    {
      path: '/watchlists/:watchlist_uuid',
      name: 'watchlist',
      component: Watchlist
    },
  ]
})
