import React from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import {Button} from "@chakra-ui/react"

const AddMumbaiNetworkButton = () => {
  const addMumbaiNetwork = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const chainId = '0x13881'; 
      const network = {
        chainId,
        chainName: 'Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      };

      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
      } catch (error) {
        console.error('Error adding Mumbai Testnet:', error);
      }
    } else {
      console.error('MetaMask not found. Please install the browser extension.');
    }
  };

  return (
    <Button colorScheme= "purple" onClick={addMumbaiNetwork}>
      Add Mumbai Testnet
    </Button>
  );
};

export default AddMumbaiNetworkButton;
