import {
  ApolloClient,
  gql,
  NormalizedCacheObject,
} from '@apollo/client';
import { cache } from './cache';

const client = new ApolloClient<NormalizedCacheObject>({
  cache,
  uri: 'http://localhost:4000/graphql',
});

client.query({
  query: gql`
    query GetLaunch {
      launch(id: 56) {
        id
        mission {
          name
        }
      }
    }
  `
}).then(result => console.log(result));
