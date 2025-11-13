import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  HttpLink,
  split,
  Operation,
  Observable,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { API_ENDPOINT } from '@/utils/constants';
import { DefinitionNode, FragmentDefinitionNode } from 'graphql';
import { Subscription } from 'zen-observable-ts';

// 👇 Type for Authentication Context
interface AuthContext {
  token: string | null;
  userId: string | null;
}

// 🟢 Create HTTP Link
const createHttpLinkInstance = (uri: string) =>
  new HttpLink({ uri });

// 🟢 Create WebSocket Link
const createWebSocketLinkInstance = (uri: string) =>
  new WebSocketLink({
    uri,
    options: {
      reconnect: true,
      timeout: 30000,
    },
  });

// 🟢 Set Auth Headers for each Operation
const withAuthHeaders = ({ token, userId }: AuthContext) => async (operation: Operation) => {
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
      isAuth: !!token,
      userId,
    },
  });
};

// 🟢 Request Link with Async Headers
const createRequestLink = (auth: AuthContext) =>
  new ApolloLink((operation, forward) =>
    new Observable((observer) => {
      let handle: Subscription;

      Promise.resolve(operation)
        .then(() => withAuthHeaders(auth)(operation))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
  );

// 🟢 Error Handler Link
const createErrorLink = () =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const { message, locations, path } of graphQLErrors) {
        const isAuthError =
          message.toLowerCase().includes('unauthenticate') ||
          message.toLowerCase().includes('unauthorize');

        if (isAuthError) {
          
          // logout(); // move this to caller or handle via event bus
        }

        
      }
    }

    if (networkError) {
      
    }
  });

// 🟢 Split link to use WS for subscriptions
const createSplitLink = (wsLink: WebSocketLink) =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query) as
        | DefinitionNode
        | (FragmentDefinitionNode & { kind: string; operation?: string });

      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink
  );

// 🧠 Main Apollo Setup Function
export const setupApolloClient = (auth: AuthContext): ApolloClient<any> => {
  const isProduction = process.env.NODE_ENV === 'production';
  const { GRAPHQL_URL, WS_GRAPHQL_URL } = isProduction
    ? API_ENDPOINT.PROD
    : API_ENDPOINT.LOCAL;

  const httpLink = createHttpLinkInstance(GRAPHQL_URL);
  const wsLink = createWebSocketLinkInstance(WS_GRAPHQL_URL);

  const splitLink = createSplitLink(wsLink);
  const requestLink = createRequestLink(auth);
  const errorLink = createErrorLink();

  const composedLink = ApolloLink.from([
    splitLink,
    requestLink,
    errorLink,
    httpLink,
  ]);

  return new ApolloClient({
    link: composedLink,
    cache: new InMemoryCache(),
  });
};
