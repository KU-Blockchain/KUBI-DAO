import { useState, useEffect } from "react";
import Web3 from "web3";
import DirectDemocracyTokenArtifact from "../abi/DirectDemocracyToken.json";
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";

const contractAddress = "0x9B5AE4442654281438aFD95c54C212e1eb5cEB2c";
const kubiMembershipNFTAddress = "0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5";

const User = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [email, setEmail] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [kubiMembershipNFTContract, setKUBIMembershipNFTContract] = useState(null);
  const [nftBalance, setNftBalance] = useState(0);
  const toast = useToast();

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
      <Text>Membership NFT Balance: {nftBalance}</Text>
      {contract && (
        <Text color="blue.500" fontWeight="bold">
          Connected to DirectDemocracyToken Contract
        </Text>
      )}
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </FormControl>
      <Button colorScheme="blue" onClick={handleJoin}>
        Join
      </Button>
    </Box>
  );
};

export default User;

