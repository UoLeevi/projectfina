import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwt');
  // return the headers to the context so httpLink can read them
  return (token
    ? {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      }
    }
    : {});
});

const httpLink = createHttpLink({ uri: 'https://api.projectfina.com/graphql' });

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    dataIdFromObject: object => object.uuid || null
  })
});
