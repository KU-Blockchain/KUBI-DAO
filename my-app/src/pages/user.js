import { useState, useEffect } from "react";
import Web3 from "web3";
import DirectDemocracyTokenArtifact from "../abi/DirectDemocracyToken.json";
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import ProjectManagerArtifact from "../abi/ProjectManager.json";
import { ethers } from "ethers";
import ipfs from "../db/ipfs";
import { useDataBaseContext } from "@/contexts/DataBaseContext";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";

const PMContract= "0x9C5ba7F2Fa8a951E982B4d9C87A0447522CfBFC2"
const contractAddress = "0x9B5AE4442654281438aFD95c54C212e1eb5cEB2c";
const kubiMembershipNFTAddress = "0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5";

const User = () => {
  const [web3, setWeb3] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [kubiMembershipNFTContract, setKUBIMembershipNFTContract] = useState(null);
  const [nftBalance, setNftBalance] = useState(0);
  const [deployedContract, setDeployedContract] = useState(null);

  const { userDetails, setUserDetails, account, setAccount, fetchUserDetails } = useDataBaseContext();



  
  const toast = useToast();

  

  useEffect(() => {
    fetchUserDetails();
  }, [web3, account]);
  

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setContract(new web3.eth.Contract(DirectDemocracyTokenArtifact.abi, contractAddress));
        setKUBIMembershipNFTContract(new web3.eth.Contract(KUBIMembershipNFTArtifact.abi, kubiMembershipNFTAddress));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No ethereum browser extension detected");
    }
  };

  useEffect(() => { connectWallet() }, []);

  const deployContract = async () => {
    if (!web3 || !account) return;
  
    const projectManagerContract = new web3.eth.Contract(ProjectManagerArtifact.abi);
    const deployOptions = {
      data: ProjectManagerArtifact.bytecode,
      arguments: [],
    };
  
    try {
      const instance = await projectManagerContract.deploy(deployOptions).send({ from: account });
      setDeployedContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };
  



  const fetchBalance = async () => {
    if (contract && account) setBalance(await contract.methods.balanceOf(account).call());
  };
  useEffect(() => { fetchBalance() }, [contract, account]);

  const fetchNFTBalance = async () => {
    if (kubiMembershipNFTContract && account) setNftBalance(await kubiMembershipNFTContract.methods.balanceOf(account).call());
  };
  useEffect(() => { fetchNFTBalance() }, [kubiMembershipNFTContract, account]);

  const mintMembershipNFT = async () => {
    if (!kubiMembershipNFTContract) return;
    try {
      await kubiMembershipNFTContract.methods.mintMembershipNFT(account, 2023, 1, "ipfs://QmSXjGAfQacm25UappNPgVq3ZxnFfH5XBM773WEzUCBBSG").send({ from: account });
      toast({ title: "Success", description: "Successfully minted Membership NFT", status: "success", duration: 5000, isClosable: true });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Error minting Membership NFT", status: "error", duration: 5000, isClosable: true });
    }
  };

  const handleJoin = async () => {
    if (!email.endsWith("@ku.edu")) {
      toast({
        title: "Invalid email domain",
        description: "Please use a valid @ku.edu email",
        status: "error",
        duration: 5000,
        isClosable: true
      });
      return;
    }

    if (!contract) return;

    try {
      await contract.methods.mint().send({ from: account });
      const newBalance = await contract.methods.balanceOf(account).call();
      setBalance(newBalance);
      await mintMembershipNFT();
      toast({
        title: "Success",
        description: `Successfully minted ${newBalance} tokens and Membership NFT`,
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error minting tokens and Membership NFT",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
      const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signer);
    
      // Fetch the accounts data IPFS hash from the smart contract
      const accountsDataIpfsHash = await contract.accountsDataIpfsHash();
      let accountsDataJson = {};
    
      // If the IPFS hash is not empty, fetch the JSON data
      if (accountsDataIpfsHash !== '') {
        accountsDataJson = await (await fetch(`https://ipfs.io/ipfs/${accountsDataIpfsHash}`)).json();
      }
    
      // Add the new user data to the existing accounts data
      accountsDataJson[account] = {
        name,
        username,
        email
      };
    
      // Save the updated accounts data to IPFS
      const ipfsResult = await ipfs.add(JSON.stringify(accountsDataJson));
      const newIpfsHash = ipfsResult.path;
    
      // Update the accounts data IPFS hash in the smart contract
      await contract.updateAccountsData(newIpfsHash);
    
      toast({
        title: "Success",
        description: "Successfully added user information",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error adding user information",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
    
    


  };

  return (
    <Box paddingLeft={4}>
      {web3 && (
        <Text color="green.500" fontWeight="bold">
          Connected to blockchain network
        </Text>
      )}
      <Text>Account: {account}</Text>
      <Text>KUBI Token Balance: {balance}</Text>
      <Text>Membership NFT Balance: {nftBalance}</Text>
      <Text>Username: {userDetails && userDetails.username}</Text>
    
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormControl>
      <FormControl id="name" mt={4}>
        <FormLabel>Name</FormLabel>
        <Input type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
      </FormControl>
      <FormControl id="username" mt={4}>
        <FormLabel>Username</FormLabel>
        <Input type="text" placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
      </FormControl>
      <Button colorScheme="blue" mt={4} onClick={handleJoin}>
        Join
      </Button>
      <Button colorScheme="teal" mt={4} onClick={deployContract}>
        Deploy Project Manager Contract
      </Button>
      {deployedContract && <Text mt={4}>Contract address: {deployedContract.options.address}</Text>}
    </Box> 
    
  );
};

export default User;

