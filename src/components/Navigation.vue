<template>
  <nav>
    <v-navigation-drawer app clipped v-model="navigation.isVisible">
      <v-list>
        <v-fade-transition group>
          <v-list-group
            v-for="section in sections.filter(s => typeof s.predicate !== 'function' || s.predicate())"
            :key="section.title"
            v-model="section.active"
            :prepend-icon="section.action"
            no-action>
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title class="grey--text text--darken-1">{{ section.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <v-list-tile v-for="(item, index) in section.getItems()" 
              :key="section.getItemKey(item, index)"
              router :to="section.getItemRoute(item, index)">
              <v-list-tile-content>
                  <v-list-tile-title>{{ section.getItemTitle(item, index) }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>{{ item.action }}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-fade-transition>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import LoadMixin from '@/mixins/LoadMixin';

export default {
  mixins: [LoadMixin],
  components: {},
  computed: {
    ...mapState('application', ['navigation']),
    ...mapState('domain', ['jwt', 'markets', 'groups', 'watchlists'])
  },
  methods: {
    ...mapActions('application', ['toggleNavigation'])
  },
  data() {
    return {
      sections: [
        {
          title: 'Markets',
          action: 'trending_up',
          getItems: () => this.markets,
          getItemKey: (market) => market.uuid,
          getItemRoute: (market) => `/markets/${market.mic}`,
          getItemTitle: (market) => `${market.mic} - ${market.name}`
        },
        {
          predicate: () => !!this.jwt,
          title: 'Watchlists',
          action: 'star',
          getItems: () => this.watchlists,
          getItemKey: (watchlist) => watchlist.uuid,
          getItemRoute: (watchlist) => `/watchlists/${watchlist.uuid}`,
          getItemTitle: (watchlist) => watchlist.name
        },
        {
          predicate: () => !!this.jwt,
          title: 'Groups',
          action: 'group',
          getItems: () => this.groups,
          getItemKey: (group) => group.uuid,
          getItemRoute: (group) => `/groups/${group.uuid}`,
          getItemTitle: (group) => group.name
        }
      ],
      dependencies: [
        {
          markets: null,
          watchlists: null,
          groups: null
        }
      ]
    };
  }
};
</script>
