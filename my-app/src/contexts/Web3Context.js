import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";


const Web3Context = createContext();

export const useWeb3Context = () => {
  return useContext(Web3Context);
};

const CONTRACT_ADDRESS = '0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5';
const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [hasNFT, setHasNFT] = useState(false);


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

    useEffect(() => {
        initProvider();
        window.addEventListener('load', initProvider);
    
        return () => {
          window.removeEventListener('load', initProvider);
        };
      }, []);

      useEffect(() => {
        const handleAccountsChanged = async (accounts) => {
          if (accounts.length > 0) {
            const signer = provider.getSigner(accounts[0]);
            setSigner(signer);
            setAccount(accounts[0]);
          }
        };
    
        if (provider) {
          provider.on('accountsChanged', handleAccountsChanged);
        }
    
        return () => {
          if (provider) {
            provider.off('accountsChanged', handleAccountsChanged);
          }
        };
      }, [provider]);

  useEffect(() => {
    const fetchNFTOwnership = async () => {
      if (provider && account && signer) {
        try {
          const contract = new ethers.Contract(CONTRACT_ADDRESS, KUBIMembershipNFTArtifact.abi, signer);

          const balance = await contract.balanceOf(account);

          // Check if NFT balance is 1, meaning the user owns the NFT
          setHasNFT(balance.toNumber() === 1);
        } catch (error) {
          console.error(error);
          setHasNFT(false);
        }
      } else {
        setHasNFT(false);
      }
    };

    fetchNFTOwnership();
  }, [provider, account, signer]);

  const value = {
    provider,
    account,
    signer,
    hasNFT,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
