import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client';

export const { apolloClient, wsClient } = createApolloClient({
  httpEndpoint: 'https://api.projectfina.com/graphql',
  wsEndpoint: 'wss://api.projectfina.com/graphql',
  tokenName: 'jwt',
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false
});
apolloClient.wsClient = wsClient;

export async function resetApolloCache() {
  if (apolloClient.wsClient) 
    restartWebsockets(apolloClient.wsClient);

  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}
