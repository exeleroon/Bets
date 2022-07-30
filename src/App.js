import logso from './logo.svg';
import React, { useEffect, useState } from "react";
import MainPage from './Components/Main';
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress } from "@usedapp/core";


function App() {


  // useEffect(() => {
  //   if (subgraphQueryError) {
  //     console.error("Error while querying subgraph:", subgraphQueryError.message);
  //     return;
  //   }
  //   if (!loading && data && data.transfers) {
  //     console.log({ transfers: data.transfers });
  //   }
  // }, [loading, subgraphQueryError, data]);

  return (
    <div className="App">
      <MainPage />
    </div>
  );
}

export default App;


