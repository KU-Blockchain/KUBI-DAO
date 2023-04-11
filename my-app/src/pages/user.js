import { useState, useEffect } from "react";
import Web3 from "web3";
import DirectDemocracyTokenArtifact from "../abi/DirectDemocracyToken.json";
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import ProjectManagerArtifact from "../abi/ProjectManager.json";
import ExecNFTArtifiact from "../abi/KUBIExecutiveNFT.json";
import KUBIXArtifact from "../abi/KUBIX.json";
import { useDataBaseContext } from "@/contexts/DataBaseContext";
import { ethers } from "ethers";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  Flex,
  Heading,
} from "@chakra-ui/react";

const PMContract= "0x9C5ba7F2Fa8a951E982B4d9C87A0447522CfBFC2"
const contractAddress = "0x9B5AE4442654281438aFD95c54C212e1eb5cEB2c";
const kubiMembershipNFTAddress = "0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5";
const KUBIExecutiveNFTAddress = "0x1F3Ae002f2058470FC5C72C70809F31Db3d93fBb";
const KUBIXcontractAddress ="0x894158b1f988602b228E39a633C7A2458A82028A"

const User = () => {
  const [web3, setWeb3] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [contract, setContract] = useState(null);
  const [KUBIXcontract, setKUBIXContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [KUBIXbalance, setKUBIXBalance] = useState(0);
  const [kubiMembershipNFTContract, setKUBIMembershipNFTContract] = useState(null);
  const [nftBalance, setNftBalance] = useState(0);
  const [deployedPMContract, setDeployedPMContract] = useState(null);
  const [deployedKUBIContract, setDeployedKUBIContract] = useState(null);
  const [deployedKUBIXContract, setDeployedKUBIXContract] = useState(null);
  const [execNftContract, setExecNftContract] = useState(null);
  const [execNftBalance, setExecNftBalance] = useState(0);
  const [showDeployMenu, setShowDeployMenu] = useState(false);

  const { userDetails, setUserDetails, account, setAccount, fetchUserDetails, addUserData } = useDataBaseContext();



  
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
        setKUBIXContract(new web3.eth.Contract(KUBIXArtifact.abi, KUBIXcontractAddress));
        setKUBIMembershipNFTContract(new web3.eth.Contract(KUBIMembershipNFTArtifact.abi, kubiMembershipNFTAddress));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("No ethereum browser extension detected");
    }
  };

  useEffect(() => { connectWallet() }, []);

  const deployPMContract = async () => {
    if (!web3 || !account) return;
  
    const projectManagerContract = new web3.eth.Contract(ProjectManagerArtifact.abi);
    const deployOptions = {
      data: ProjectManagerArtifact.bytecode,
      arguments: [],
    };
  
    try {
      const instance = await projectManagerContract.deploy(deployOptions).send({ from: account });
      setDeployedPMContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };
  
  const deployKUBIContract = async () => {
    if (!web3 || !account) return;
  
    const KUBIContract = new web3.eth.Contract(ExecNFTArtifiact.abi);
    const deployOptions = {
      data: ExecNFTArtifiact.bytecode,
      arguments: ["https://ipfs.io/ipfs/QmXrAL39tPc8wWhvuDNNp9rbaWwHPnHhZC28npMGVJvm3N"
    ],
    };
  
    try {
      const instance = await KUBIContract.deploy(deployOptions).send({ from: account });
      setDeployedKUBIContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const deployKUBIXContract = async () => {
    if (!web3 || !account) return;
  
    const KUBIXContract = new web3.eth.Contract(KUBIXArtifact.abi);
    const deployOptions = {
      data: KUBIXArtifact.bytecode,
      arguments: [],
    };
  
    try {
      const instance = await KUBIXContract.deploy(deployOptions).send({ from: account });
      setDeployedKUBIXContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const fetchBalance = async () => {
    if (contract && account) setBalance(await contract.methods.balanceOf(account).call());
  };
  useEffect(() => { fetchBalance() }, [contract, account]);

  const fetchKUBIXBalance = async () => {
    let temp = 0;
    if (KUBIXcontract && account) {
      temp = await KUBIXcontract.methods.balanceOf(account).call();
    }
  
    setKUBIXBalance(ethers.utils.formatEther(temp));
  };
  
  useEffect(() => { fetchKUBIXBalance() }, [KUBIXcontract, account]);

  const fetchNFTBalance = async () => {
    if (kubiMembershipNFTContract && account) setNftBalance(await kubiMembershipNFTContract.methods.balanceOf(account).call());
  };
  useEffect(() => { fetchNFTBalance() }, [kubiMembershipNFTContract, account]);


  const mintMembershipNFT = async () => {
    if (!kubiMembershipNFTContract) return;
    try {
      const provider2 = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
      const signer2 = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider2);

      const contract = new ethers.Contract(kubiMembershipNFTAddress, KUBIMembershipNFTArtifact.abi, signer2);
      const transaction = await contract.mintMembershipNFT(account, 2023, 1, "ipfs://QmSXjGAfQacm25UappNPgVq3ZxnFfH5XBM773WEzUCBBSG");
      await transaction.wait();
      toast({ title: "Success", description: "Successfully minted Membership NFT", status: "success", duration: 5000, isClosable: true });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Error minting Membership NFT", status: "error", duration: 5000, isClosable: true });
    }
  };

  useEffect(() => {
    if (web3) {
      setExecNftContract(new web3.eth.Contract(ExecNFTArtifiact.abi, KUBIExecutiveNFTAddress));
    }
  }, [web3]);

  const fetchExecNFTBalance = async () => {
    if (execNftContract && account) {
      setExecNftBalance(await execNftContract.methods.balanceOf(account).call());
    }
  };

  useEffect(() => { fetchExecNFTBalance() }, [execNftContract, account]);

  const mintExecutiveNFT = async () => {
    if (!execNftContract) return;
    try {
      await execNftContract.methods.mint(account).send({ from: account });
      toast({ title: "Success", description: "Successfully minted Executive NFT", status: "success", duration: 5000, isClosable: true });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Error minting Executive NFT", status: "error", duration: 5000, isClosable: true });
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
      //await contract.methods.mint().send({ from: account });
      //const newBalance = await contract.methods.balanceOf(account).call();
      //setBalance(newBalance);
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

    //adds user data to ipfs and smart contract
    try{
      addUserData(name,username,email);
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
    <Flex
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="center"
      p={6}
      mt={6}
      w="100%"
      maxWidth="1200px"
      mx="auto"
      bg="white"
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        w="100%"
        maxWidth="600px"
        bg="white"
      >
        <Heading as="h2" size="lg" mb={6}>
          KUBI User Dashboard
        </Heading>
        {web3 && (
          <Text color="green.500" fontWeight="bold">

            Wallet Connected
          </Text>
        )}
        <Text >Username: {userDetails && userDetails.username}</Text>
        <Text mt= {4}>Account:</Text>
        <Text>{account}</Text>
        <Text mt={4}>KUBI Token Balance: {balance}</Text>
        <Text>KUBIX Token Balance: {KUBIXbalance}</Text>
        <Text>Membership NFT Balance: {nftBalance}</Text>
        <Text>Executive NFT Balance: {execNftBalance}</Text>
        

      </Flex>
      <Box
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        ml={4}
        w="100%"
        maxWidth="600px"
        bg="gray.50"
      >
        <Heading as="h2" size="lg" mb={6}>
          Join KUBI DAO
        </Heading>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="KU Email required" value={email} onChange={(event) => setEmail(event.target.value)} />
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
      </Box>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        ml={4}
        w="100%"
        maxWidth="600px"
        bg="white"
      >

        <Heading as="h2" size="lg" mb={6}>
            Developer Menu
        </Heading>

        <Button colorScheme="orange" mt={4} onClick={() => setShowDeployMenu(!showDeployMenu)}>
          Deploy Menu
        </Button>
        {showDeployMenu && (
          <>
            <Button colorScheme="teal" mt={4} onClick={deployPMContract}>
              Deploy Project Manager Contract
            </Button>
            {deployedPMContract && <Text mt={4}>Contract address: {deployedPMContract.options.address}</Text>}
            <Button colorScheme="teal" mt={4} onClick={deployKUBIContract}>
              Deploy Executive NFT Contract
              </Button>
            <Button colorScheme="teal" mt={4} onClick={deployKUBIXContract}>
              Deploy KUBIX token Contract
            </Button>
            {deployedKUBIXContract && <Text mt={4}>Contract address: {deployedKUBIXContract.options.address}</Text>}
            <Button colorScheme="purple" mt={4} onClick={mintExecutiveNFT}>
              Mint Executive NFT
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default User;
