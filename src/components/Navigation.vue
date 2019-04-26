<template>
  <nav>
    <v-navigation-drawer app clipped v-model="navigation.isVisible">
      <v-list>
        <v-fade-transition group>
          <NavigationSection v-if="graph.markets"
            key="markets"
            title="Markets"
            action="trending_up"
            :items="() => graph.markets
              .map(market => market)
              .sort((a, b) => a.name < b.name ? -1 : 0)"
            itemKey="uuid"
            itemTitle="name"
            :itemRoute="(market) => `/markets/${market.mic}`"
            />
          <NavigationSection v-if="graph.me"
            key="watchlists"
            title="Watchlists"
            action="star"
            :items="() => this.graph.me.watchlistsConnection.edges
              .map(edge => edge.node)
              .sort((a, b) => a.name < b.name ? -1 : 0)"
            itemKey="uuid"
            itemTitle="name"
            :itemRoute="(watchlist) => `/watchlists/${watchlist.uuid}`">
            <template #footer>
              <CreateWatchlistForm :dialog.sync="dialogs.createWatchlist" class="ml-4" />
            </template>
          </NavigationSection>
          <NavigationSection v-if="graph.me"
            key="groups"
            title="Groups"
            action="group"
            :items="() => this.graph.me.groupsConnection.edges
            .map(edge => edge.node)
            .sort((a, b) => a.name < b.name ? -1 : 0)"
            itemKey="uuid"
            itemTitle="name"
            :itemRoute="(group) => `/groups/${group.uuid}`"
            />
        </v-fade-transition>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import NavigationSection from '@/components/NavigationSection';
import CreateWatchlistForm from '@/components/CreateWatchlistForm';
import GraphQLMixin from '@/mixins/GraphQLMixin';

export default {
  mixins: [GraphQLMixin],
  components: {
    NavigationSection,
    CreateWatchlistForm
  },
  computed: {
    ...mapState('application', ['navigation']),
    ...mapState('domain', ['jwt'])
  },
  methods: {
    ...mapActions('application', ['toggleNavigation'])
  },
  data() {
    return {
      dialogs: {
        createWatchlist: false
      },
      watchQuery: `query myBasicInfo {
        markets {
          uuid
          mic
          name
        }
        me {
          uuid
          watchlistsConnection {
            edges {
              node {
                uuid
                name
              }
            }
          }
          groupsConnection {
            edges {
              node {
                uuid
                name
              }
            }
          }
        }
      }`
    };
  }
};
</script>
