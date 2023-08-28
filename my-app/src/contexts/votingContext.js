import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

import KubixVotingABI from '../abi/KubixVoting.json';
import KubidVotingABI from '../abi/KubidVoting.json';

import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useWeb3Context } from '@/contexts/Web3Context';


const contractX = new ethers.Contract('0x4Af0e1994c8e03414ffd523aAc645049bcdadbD6', KubixVotingABI.abi, signerUniversal);
const contractD = new ethers.Contract('0xaf395fbBdc0E2e99ae18D42F2724481BF1Ab02c8', KubidVotingABI.abi, signerUniversal);

const votingContext = createContext();

export const useVoting = () => {
    return useContext(votingContext);
  };
  
  
  
  export const votingProvider = ({ children }) => {


    return (
        <votingContext.Provider value={{ }}>
          {children}
        </votingContext.Provider>
      );

  };