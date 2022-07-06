
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Mainnet, DAppProvider, Config, ChainId } from '@usedapp/core'

const INFURA_PROJECT_ID = "0ca6dbeae7224218bbd2fc8df4a32953";

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
  },
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app",
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DAppProvider config={config}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </DAppProvider>
);

reportWebVitals();