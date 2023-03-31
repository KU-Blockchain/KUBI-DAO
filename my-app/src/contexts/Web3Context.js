import React, { createContext, useContext, useState } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const useWeb3Context = () => {
  return useContext(Web3Context);
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(new Web3(Web3.givenProvider || 'http://localhost:8545'));

  const value = {
    web3,
    setWeb3,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
