import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { providers, JsonRpcBatchProvider, ethers } from 'ethers';
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import ExecNFTArtifact from "../abi/KUBIExecutiveNFT.json";
import KUBIXTokenArtifact from "../abi/KUBIX.json";
import DirectDemocracyTokenArtifact from "../abi/DirectDemocracyToken.json";
import ProjectManagerArtifact from "../abi/ProjectManager.json";
import Web3 from 'web3';
import { useIPFScontext } from './IPFScontext';



const Web3Context = createContext();

export const useWeb3Context = () => {
  return useContext(Web3Context);
};

const kubiMembershipNFTAddress = '0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5';
const KUBIExecutiveNFTAddress = '0x1F3Ae002f2058470FC5C72C70809F31Db3d93fBb';
const KUBIXcontractAddress = "0x894158b1f988602b228E39a633C7A2458A82028A"
const PMContractAddress= "0x50a07e25780A6cBfF63c8B96fd756D736C48CE11"
const contractAddress = "0x5F9A878411210E1c305cB07d26E50948c84694eA";


export const Web3Provider = ({ children }) => {
  const { fetchFromIpfs, addToIpfs } = useIPFScontext();

  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [hasMemberNFT, setMemberNFT] = useState(false);
  const [hasExecNFT, setExecNFT] = useState(false);
  const [PMContract, setPMcontract] = useState(null);
  const [KUBIXbalance, setKUBIXBalance] = useState(0);
  const [KUBIXcontract, setKUBIXContract] = useState(null);
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [kubiMembershipNFTContract, setKUBIMembershipNFTContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [nftBalance, setNftBalance] = useState(0);
  const [execNftContract, setExecNftContract] = useState(null);
  const [execNftBalance, setExecNftBalance] = useState(0);
  const [providerUniversal, setProviderUniversal] = useState(new providers.StaticJsonRpcProvider(process.env.NEXT_PUBLIC_GROVE_URL));
  const [isConnected, setIsConnected] = useState(false);
  
  const privateKeys = [
    process.env.NEXT_PUBLIC_PRIVATE_KEY,
    process.env.NEXT_PUBLIC_PRIVATE_KEY_2,
    process.env.NEXT_PUBLIC_PRIVATE_KEY_3,
  ];

  // Generate a random index between 0 and the array length - 1
  const randomIndex = Math.floor(Math.random() * privateKeys.length);


  // Initialize state with a random signer
  const [signerUniversal, setSignerUniversal] = useState(new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, providerUniversal));








  //initalizes provider and signer for the 
  const initProvider = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setContract(new web3.eth.Contract(DirectDemocracyTokenArtifact.abi, contractAddress));
        setKUBIXContract(new web3.eth.Contract(KUBIXTokenArtifact.abi, KUBIXcontractAddress));
        setKUBIMembershipNFTContract( new ethers.Contract(kubiMembershipNFTAddress, KUBIMembershipNFTArtifact.abi, signerUniversal));
        console.log("contravts set")
        await fetchBalance()
        await fetchNFTBalance()
        await fetchKUBIXBalance() 
        setIsConnected(true);
        
    

      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No ethereum browser extension detected");
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
      if(execNftBalance== 1){
        setExecNFT(true);
        console.log("execNFT is true")
      }
      else{
        console.log("execNFT is false")
      }
      if(nftBalance== 1){
        setMemberNFT(true);
        console.log("member is true")
      }
      else{
        console.log("member is false")
      }
    }, [execNftBalance, nftBalance]);

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

      const fetchNFTOwnership = useCallback(async () => {
        if (provider && account && signer) {
          try {
      
            // Fetch the balances of both NFTs in parallel
            const [memberBalance, execBalance] = await Promise.all([
              kubiMembershipNFTContract.balanceOf(account),
              execNftContract.balanceOf(account),
            ]);
      
            // Check if NFT balances are 1, meaning the user owns the NFTs
            setMemberNFT(memberBalance.toNumber() === 1);
            setExecNFT(execBalance.toNumber() === 1);
          } catch (error) {
            console.error(error);
          }
        } else {

        }
      }, [provider, account, signer]);
      

    //checks exec NFT ownership and membership NFT ownership
    useEffect(() => {
      fetchNFTOwnership();
    }, [provider, account, signer]);

    


    const mintKUBIX = async (to, amount, taskCompleted = false) => {
      try {
        const contract = new ethers.Contract(KUBIXcontractAddress, KUBIXTokenArtifact.abi, signerUniversal);
        const contractPM = new ethers.Contract(PMContractAddress, ProjectManagerArtifact.abi, signerUniversal);
    
        // Fetch the accountsData IPFS hash from the smart contract
        const accountsDataIpfsHash = await contractPM.accountsDataIpfsHash();
        let accountsDataJson = {};
        console.log("checking accountsDataIpfsHash");
    
        // If the IPFS hash is not empty, fetch the JSON data
        if (accountsDataIpfsHash !== '') {
          accountsDataJson = await fetchFromIpfs(accountsDataIpfsHash);
        }
    
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let semester = '';
        let month = currentDate.getMonth();
        let date = currentDate.getDate();
        
        if (month < 5) {
            semester = 'Spring';
        } else if (month < 7 || (month === 7 && date < 16)) { // Before August 16th
            semester = 'Summer';
        } else {
            semester = 'Fall';
        }
        
        console.log(semester);
        
        const yearSemester = `${currentYear}${semester}`;
    
        if (accountsDataJson[to]) {
          let currentkubix = await KUBIXcontract.methods.balanceOf(to).call();
          const balance = ethers.BigNumber.from(currentkubix);
          const balanceFinal = parseFloat(ethers.utils.formatEther(balance));
    
          accountsDataJson[to].kubixBalance = (Math.round((balanceFinal + amount)));
          accountsDataJson[to][`kubixBalance${yearSemester}`] = (Math.round((accountsDataJson[to][`kubixBalance${yearSemester}`] || 0) + amount));
          console.log("old balance", accountsDataJson[to][`kubixBalance${yearSemester}`])

    
          if (taskCompleted) {
            accountsDataJson[to].tasksCompleted = (accountsDataJson[to].tasksCompleted || 0) + 1;
            accountsDataJson[to][`tasksCompleted${yearSemester}`] = (accountsDataJson[to][`tasksCompleted${yearSemester}`] || 0) + 1;
          }
        } else {
          accountsDataJson[to] = {
            kubixBalance: amount,
            tasksCompleted: taskCompleted ? 1 : 0,
            [`kubixBalance${yearSemester}`]: amount,
            [`tasksCompleted${yearSemester}`]: taskCompleted ? 1 : 0,
          };
        }
    
        // Save the updated accounts data to IPFS
        const ipfsResult = await addToIpfs(JSON.stringify(accountsDataJson));
        const newIpfsHash = ipfsResult.path;
        console.log("newIpfsHash", newIpfsHash)
    
        // Update the accounts data IPFS hash in the smart contract
       const tx1= await contractPM.updateAccountsData(newIpfsHash);
      await tx1.wait();
    
        // Mint the token
        const amountToMint = ethers.utils.parseUnits(amount.toString(), 18);
    
        const tx= await contract.mint(to, amountToMint);
        await tx.wait();

      } catch (error) {
        console.error("Error minting KUBIX:", error);
      }
    };
    

  //fetches kubix balance for acocunt
  const fetchKUBIXBalance = async () => {
    let temp = 0;
    if (KUBIXcontract && account) {
      temp = await KUBIXcontract.methods.balanceOf(account).call();
    }
    console.log(ethers.utils)
    setKUBIXBalance(Math.round(ethers.utils.formatEther(temp)));
  };
  
  useEffect(() => { fetchKUBIXBalance() }, [account]);

  //fetches KUBID balance
  const fetchBalance = async () => {
    if (contract && account) setBalance(await contract.methods.balanceOf(account).call());
  };
  useEffect(() => { fetchBalance() }, [account]);

  //fetches member NFT balance
  const fetchNFTBalance = async () => {
    try{
      console.log("fetching NFT balance")
    if (kubiMembershipNFTContract && account) setNftBalance((await kubiMembershipNFTContract.balanceOf(account)).toNumber());
    
    }
    catch(error){
      console.log(error)
    } 
  };

  useEffect(() => { fetchNFTBalance() }, [account]);

  useEffect(() => {
    if (web3) {
      setExecNftContract(new web3.eth.Contract(ExecNFTArtifact.abi, KUBIExecutiveNFTAddress));
    }
  }, [web3]);

  const fetchExecNFTBalance = async () => {
    if (execNftContract && account) {
      setExecNftBalance(await execNftContract.methods.balanceOf(account).call());
    }
  };

  useEffect(() => { fetchExecNFTBalance() }, [account]);
  
  

  const value = {
    provider,
    account,
    signer,
    hasMemberNFT,
    hasExecNFT,
    mintKUBIX,
    KUBIExecutiveNFTAddress,
    kubiMembershipNFTAddress,
    contractAddress,
    KUBIXcontractAddress,
    KUBIXbalance,
    KUBIXcontract,
    contract,
    kubiMembershipNFTContract,
    web3,
    account,
    balance,
    nftBalance,
    fetchBalance,
    execNftBalance,
    execNftContract,
    signerUniversal,
    providerUniversal,
    isConnected,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};