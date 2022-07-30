
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  Mainnet,
  Kovan,
  DAppProvider,
  Config,
  Ropsten,
  Rinkeby,
  Goerli
} from '@usedapp/core'

const INFURA_PROJECT_ID = "0ca6dbeae7224218bbd2fc8df4a32953";

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    [Kovan.chainId]: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
    [Ropsten.chainId]: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
    [Rinkeby.chainId]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
    [Goerli.chainId]: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
  },
  gasLimitBufferPercentage: 10,
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DAppProvider config={config}>
    <App />
  </DAppProvider>
);

reportWebVitals();