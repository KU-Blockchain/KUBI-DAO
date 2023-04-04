import { useState, useEffect } from "react";
import Web3 from "web3";
import DirectDemocracyTokenArtifact from "../abi/DirectDemocracyToken.json";
import KUBIMembershipNFTArtifact from "../abi/MembershipNFT.json";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

const User = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [email, setEmail] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [kubiMembershipNFTContract, setKUBIMembershipNFTContract] = useState(null);

  const toast = useToast();

  const contractAddress = "0x9B5AE4442654281438aFD95c54C212e1eb5cEB2c";
  const kubiMembershipNFTAddress = "0x425111052B935B4E7ddb99E609aF84660d5DB94d";



  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });
          // Instantiate web3 object
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          // Get the user's account address
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
  
          // Create contract instance for DirectDemocracyToken
          const contractInstance = new web3.eth.Contract(
            DirectDemocracyTokenArtifact.abi,
            contractAddress
          );
          setContract(contractInstance);
  
          // Create contract instance for KUBIMembershipNFT
          const kubiMembershipNFTContractInstance = new web3.eth.Contract(
            KUBIMembershipNFTArtifact.abi,
            kubiMembershipNFTAddress
          );
          setKUBIMembershipNFTContract(kubiMembershipNFTContractInstance);
  
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No ethereum browser extension detected");
      }
    };
  
    connectWallet();
  }, []);
  

  useEffect(() => {
    const fetchBalance = async () => {
      if (contract && account) {
        const currentBalance = await contract.methods.balanceOf(account).call();
        setBalance(currentBalance);
      }
    };
    fetchBalance();
  }, [contract, account]);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const mintMembershipNFT = async () => {
    if (kubiMembershipNFTContract) {
      try {
        const id = 1; // Set the NFT id, this should be unique
        const schoolYear = 2023;
        const tier = 1;
        const ipfsLink = "ipfs://QmSXjGAfQacm25UappNPgVq3ZxnFfH5XBM773WEzUCBBSG";
  
        await kubiMembershipNFTContract.methods
          .mintMembershipNFT(account, id, schoolYear, tier, ipfsLink)
          .send({ from: account });
  
        toast({
          title: "Success",
          description: "Successfully minted Membership NFT",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
  
        toast({
          title: "Error",
          description: "Error minting Membership NFT",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  
  
  const handleJoin = async () => {
    if (email.endsWith("@ku.edu")) {
      if (contract) {
        try {
          //await contract.methods.mint().send({ from: account });
          //const newBalance = await contract.methods.balanceOf(account).call();
          //setBalance(newBalance);
  
          await mintMembershipNFT();
  
          toast({
            title: "Success",
            description: `Successfully minted ${newBalance} tokens and Membership NFT`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } catch (error) {
          console.error(error);
  
          toast({
            title: "Error",
            description: "Error minting tokens and Membership NFT",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } else {
      toast({
        title: "Error",
        description: "Invalid email domain",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
  
    }
  };

  return (
    <Box>
      {web3 && (
        <Text color="green.500" fontWeight="bold">
          Connected to blockchain network
        </Text>
      )}
      <Text>Account: {account}</Text>
      <Text>KUBI Token Balance: {balance}</Text>
      {contract && (
        <Text color="blue.500" fontWeight="bold">
          Connected to DirectDemocracyToken Contract
        </Text>
      )}
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Email" value={email} onChange={handleChange} />
      </FormControl>
      <Button colorScheme="blue" onClick={handleJoin}>
        Join
      </Button>


    </Box>
  );
};

export default User;
