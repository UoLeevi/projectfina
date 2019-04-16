import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { apolloClient } from '@/apollo';

// Install the vue plugin
Vue.use(VueApollo)

// Call this in the Vue app file
export default new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      // fetchPolicy: 'cache-and-network',
    },
  },
  errorHandler (error) {
    // eslint-disable-next-line no-console
    console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
  },
});
