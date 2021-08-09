import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  gql
} from '@apollo/client';
import { cache } from './cache';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles';

// client graphqlスキーマ
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`

const client = new ApolloClient<NormalizedCacheObject>({
  cache,
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: localStorage.getItem('token') || '',
  },
  typeDefs,
});

injectStyles();

// Pass the ApolloClient instance to ApolloProvider component
ReactDOM.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById('root')
);

