import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3Context = () => {
  return useContext(Web3Context);
};

const CONTRACT_ADDRESS = '0x2B55E639d3191441651543D3A6b31e3FF0304b96';
const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      // Check if Web3 has been injected by MetaMask
      if (typeof window.ethereum !== 'undefined') {
        // Use MetaMask provider
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        setProvider(web3Provider);
        const signer = web3Provider.getSigner();
        setSigner(signer);
        const accounts = await signer.getAddress();
        setAccount(accounts);

      } else {
        // Fallback to Infura provider
        const infuraProvider = new ethers.providers.InfuraProvider('mainnet', INFURA_PROJECT_ID);
        setProvider(infuraProvider);
        
        const privateKey = 'YOUR_PRIVATE_KEY_HERE';
        const wallet = new ethers.Wallet(privateKey, infuraProvider);
        const signer = wallet.connect(infuraProvider);
        setSigner(signer);
        const accounts = await signer.getAddress();
        setAccount(accounts);
      }
    };

    initProvider();
  }, []);

  const checkNFTOwnership = async () => {
    console.log('provider:', provider);
    console.log('account:', account);
    console.log('signer:', signer);
    if (provider && account && signer) {
      try {
        console.log('check1');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ['function balanceOf(address) returns (uint256)'], signer);
        console.log('check2');
        
        const balance = await contract.balanceOf(account);

        console.log('check3');
        

        console.log('NFT count:', balance.toNumber());

        return balance.toNumber() > 0;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return false;
  };

  const value = {
    provider,
    account,
    signer,
    checkNFTOwnership,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
