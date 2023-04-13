import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import ExecNFTArtifact from "../abi/KUBIExecutiveNFT.json";
import KUBIXTokenArtifact from "../abi/KUBIX.json";
import ProjectManagerArtifact from "../abi/ProjectManager.json";
import ipfs from '../db/ipfs';



const Web3Context = createContext();

export const useWeb3Context = () => {
  return useContext(Web3Context);
};

const membershipNFTAdress = '0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5';
const execNFTAdress = '0x1F3Ae002f2058470FC5C72C70809F31Db3d93fBb';
const kubixTokenAddress = "0x894158b1f988602b228E39a633C7A2458A82028A"
const PMContract= "0x9C5ba7F2Fa8a951E982B4d9C87A0447522CfBFC2"
const INFURA_PROJECT_ID = process.env.NEXT_PUBIC_INFURA_PROJECT_ID;

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [hasMemberNFT, setMemberNFT] = useState(false);
  const [hasExecNFT, setExecNFT] = useState(false);
  const [PMContract, setPMcontract] = useState(null);
  




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



    //checks exec NFT ownership and membership NFT ownership
    useEffect(() => {
      const fetchNFTOwnership = async () => {
        if (provider && account && signer) {
          try {
            const memberContract = new ethers.Contract(membershipNFTAdress, KUBIMembershipNFTArtifact.abi, signer);
            const execContract = new ethers.Contract(execNFTAdress, ExecNFTArtifact.abi, signer);

            // Fetch the balances of both NFTs in parallel
            const [memberBalance, execBalance] = await Promise.all([
              memberContract.balanceOf(account),
              execContract.balanceOf(account),
            ]);

            // Check if NFT balances are 1, meaning the user owns the NFTs
            setMemberNFT(memberBalance.toNumber() === 1);
            setExecNFT(execBalance.toNumber() === 1);
          } catch (error) {
            console.error(error);
            setMemberNFT(false);
            setExecNFT(false);
          }
        } else {
          setMemberNFT(false);
          setExecNFT(false);
        }
      };

      fetchNFTOwnership();
    }, [provider, account, signer]);




  const mintKUBIX = async (to, amount, taskCompleted = false) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
      const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(kubixTokenAddress, KUBIXTokenArtifact.abi, signer);

      const contractPM = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signer);


  
      // Fetch the accountsData IPFS hash from the smart contract
      const accountsDataIpfsHash = await contractPM.accountsDataIpfsHash();
      let accountsDataJson = {};
  
      // If the IPFS hash is not empty, fetch the JSON data
      if (accountsDataIpfsHash !== '') {
        accountsDataJson = await (await fetch(`https://ipfs.io/ipfs/${accountsDataIpfsHash}`)).json();
      }
  
      // Add the Kubix wallet balance and task completed data point to the account data
      if (accountsDataJson[to]) {
        accountsDataJson[to].kubixBalance = (accountsDataJson[to].kubixBalance || 0) + amount;
        if (taskCompleted) {
          accountsDataJson[to].tasksCompleted = (accountsDataJson[to].tasksCompleted || 0) + 1;
        }
      } else {
        accountsDataJson[to] = {
          kubixBalance: amount,
          tasksCompleted: taskCompleted ? 1 : 0,
        };
      }
  
      // Save the updated accounts data to IPFS
      const ipfsResult = await ipfs.add(JSON.stringify(accountsDataJson));
      const newIpfsHash = ipfsResult.path;
  
      // Update the accounts data IPFS hash in the smart contract
      await contractPM.updateAccountsData(newIpfsHash);
  
      // Mint the token
      const amountToMint = ethers.utils.parseUnits(amount.toString(), 18);

      await contract.mint(to, amountToMint);
    } catch (error) {
      console.error("Error minting KUBIX:", error);
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