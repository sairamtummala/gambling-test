import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import createStore from "./store/createStore";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://gambilife.com/graphql'
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://gambilife.com/`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  uri: 'http://gambilife.com/graphql',
});
const initialState = {};
const store = createStore(initialState);

console.log(client, link);

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
      
    </Provider>,
    document.getElementById("root")
  );
};

renderApp();

if (module.hot) {
  module.hot.accept("./App", renderApp);
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
