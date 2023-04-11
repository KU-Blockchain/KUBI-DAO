import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import ExecNFTArtifact from "../abi/KUBIExecutiveNFT.json";
import KUBIXTokenArtifact from "../abi/KUBIX.json";



const Web3Context = createContext();

export const useWeb3Context = () => {
  return useContext(Web3Context);
};

const membershipNFTAdress = '0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5';
const execNFTAdress = '0x1F3Ae002f2058470FC5C72C70809F31Db3d93fBb';
const kubixTokenAddress = "0x894158b1f988602b228E39a633C7A2458A82028A"
const INFURA_PROJECT_ID = process.env.NEXT_PUBIC_INFURA_PROJECT_ID;

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [hasMemberNFT, setMemberNFT] = useState(false);
  const [hasExecNFT, setExecNFT] = useState(false);
  




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
        alert('Reload the page with MetaMask');

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
    const fetchMemberNFTOwnership = async () => {
      if (provider && account && signer) {
        try {
          const contract = new ethers.Contract(membershipNFTAdress, KUBIMembershipNFTArtifact.abi, signer);

          const balance = await contract.balanceOf(account);

          // Check if NFT balance is 1, meaning the user owns the NFT
          setMemberNFT(balance.toNumber() === 1);
        } catch (error) {
          console.error(error);
          setMemberNFT(false);
        }
      } else {
        setMemberNFT(false);
      }
    };

    fetchMemberNFTOwnership();
  }, [provider, account, signer]);

  //checks exec NFT ownership 
  useEffect(() => {
    const fetchExecNFTOwnership = async () => {
      if (provider && account && signer) {
        try {
          const contract = new ethers.Contract(execNFTAdress, ExecNFTArtifact.abi, signer);

          const balance = await contract.balanceOf(account);

          // Check if NFT balance is 1, meaning the user owns the executive NFT
          setExecNFT(balance.toNumber() === 1);
        } catch (error) {
          console.error(error);
          setExecNFT(false);
        }
      } else {
        setExecNFT(false);
      }
    };

    fetchExecNFTOwnership();
  }, [provider, account, signer]);

  const mintKUBIX = async (to, amount) => {
    const provider2 = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
    const signerHudson = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider2);
    
    if (signerHudson) {
      try {
        const kubixToken = new ethers.Contract(kubixTokenAddress, KUBIXTokenArtifact.abi, signerHudson);
        const mintTx = await kubixToken.mint(to, ethers.utils.parseEther(amount.toString()));
        await mintTx.wait();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No signer available");
    }
  };
  

  const value = {
    provider,
    account,
    signer,
    hasMemberNFT,
    hasExecNFT,
    mintKUBIX,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
