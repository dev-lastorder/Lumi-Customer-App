import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { Href } from 'expo-router';

export const API_ENDPOINT = {
  LOCAL: {
    GRAPHQL_URL: 'https://v1-api-enatega-multivendor-main-customer.up.railway.app/graphql',
    WS_GRAPHQL_URL: 'ws://v1-api-enatega-multivendor-main-customer.up.railway.app/graphql',
    SERVER_URL: 'https://v1-api-enatega-multivendor-main-customer.up.railway.app',

    // GRAPHQL_URL: 'http://192.168.100.78:8001/graphql',
    // WS_GRAPHQL_URL: 'ws://192.168.100.78:8001/graphql',
    // SERVER_URL: 'http://192.168.100.78:8001/',
  },
  PROD: {
    // GRAPHQL_URL: 'http://192.168.18.99:8001/graphql',
    // WS_GRAPHQL_URL: 'ws://192.168.18.99:8001/graphql',
    // SERVER_URL: 'http://192.168.18.99:8001/graphql',

    GRAPHQL_URL: 'https://v1-api-enatega-multivendor-main-customer.up.railway.app/graphql',
    WS_GRAPHQL_URL: 'wss://v1-api-enatega-multivendor-main-customer.up.railway.app/graphql',
    SERVER_URL: 'https://v1-api-enatega-multivendor-main-customer.up.railway.app/',
  },
};

export const PROTECTED_ROUTE: Record<string, string> = {
  '(profile)': '/(food-delivery)/(profile)/profile-main',
};
export const ROUTE = {
  LOGIN: '/(food-delivery)/(profile)/login',
};

export const DETAILS_ROUTE_BASED_ON_SHOP_TYPE = new Map<string, Href>([
  ['restaurant', '/restaurant-details'],
  ['grocery', '/store-details'],
  ['store', '/store-details'],
]);

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
