import { useState, useEffect } from "react";
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import ProjectManagerArtifact from "../abi/ProjectManager.json";
import ExecNFTArtifiact from "../abi/KUBIExecutiveNFT.json";
import KUBIXArtifact from "../abi/KUBIX.json";
import { useDataBaseContext } from "@/contexts/DataBaseContext";
import { useWeb3Context } from "@/contexts/Web3Context";
import { ethers } from "ethers";
import MumbaiButton from "../components/userPage/importMumbai";

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
  Modal,		
  ModalOverlay,		
  ModalContent,		
  ModalHeader,		
  ModalBody,		
  ModalCloseButton,		
  ModalFooter,
  Spacer
} from "@chakra-ui/react";

import KubixButton from "@/components/userPage/KubixButton";
import DeployMenu from "@/components/userPage/DeployMenu";
import MintMenu from "@/components/userPage/MintMenu";
import DataMenu from "@/components/userPage/DataMenu";



const User = () => {
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const [deployedPMContract, setDeployedPMContract] = useState(null);
  const [deployedKUBIContract, setDeployedKUBIContract] = useState(null);
  const [deployedKUBIXContract, setDeployedKUBIXContract] = useState(null);



  
  const [mintAddress, setMintAddress] = useState("");

  const [showDataMenu, setShowDataMenu] = useState(false);
  const [projectHashesInput, setProjectHashesInput] = useState([]);
  const [dataHashInput, setDataHashInput] = useState("");
  const [phrase,setPhrase]=useState("Join");

  const { userDetails, setUserDetails,  setAccount, fetchUserDetails, addUserData, clearData, pushProjectHashes } = useDataBaseContext();
  const{ execNftContract,execNftBalance,balance,nftBalance, fetchBalance,web3, account,kubiMembershipNFTContract, contract,KUBIXbalance,KUBIXcontract, KUBIXcontractAddress, contractAddress, kubiMembershipNFTAddress,KUBIExecutiveNFTAddress}=useWeb3Context();


  
  const toast = useToast();

  

  useEffect(() => {
    fetchUserDetails(web3,account);
  }, [web3, account]);
  


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
  
    
    const deployOptions = {
      data: KUBIXArtifact.bytecode,
      arguments: [],
    };
  
    try {
      const instance = await KUBIXcontract.deploy(deployOptions).send({ from: account });
      setDeployedKUBIXContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };




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



  const mintExecutiveNFT = async (mintAdress1) => {
    if (!execNftContract) return;
    try {
      await execNftContract.methods.mint(mintAddress1).send({ from: account });
      toast({ title: "Success", description: "Successfully minted Executive NFT", status: "success", duration: 5000, isClosable: true });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Error minting Executive NFT", status: "error", duration: 5000, isClosable: true });
    }
    closeMintModal();
  };



  const handleJoin = async (e) => {
    setPhrase("Joining...")
    e.target.disabled=true
    if (!email.endsWith("@ku.edu")) {
      toast({
        title: "Invalid email domain",
        description: "Please use a valid @ku.edu email",
        status: "error",
        duration: 5000,
        isClosable: true
      });
      setPhrase("Join")
      e.target.disabled=false
      return;

    }

        //adds user data to ipfs and smart contract
        try{
          const checkUsername = await addUserData(name,username,email);
          if(checkUsername != true){
            toast({
              title: "Error",
              description: "Username already exists",
              status: "error",
              duration: 5000,
              isClosable: true
            });
    
          } 
    
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
    setPhrase("Join")
    e.target.disabled=false
    if (!contract) return;

    try {
      await contract.methods.mint().send({ from: account });
      const newBalance = await contract.methods.balanceOf(account).call();
      fetchBalance()
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

  

  const handleAddHashes = async () => {
    if (projectHashesInput.length === 0 || dataHashInput === "") {
      // Show error message if the inputs are not valid
      return;
    }
  
    await pushProjectHashes(projectHashesInput, dataHashInput);
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
          {phrase}
        </Button>
        <Heading as="h2" size="md" mb={4} mt={4}>
          Import Tokens to Metamask
        </Heading>
        <KubixButton />
        <Heading as="h2" size="md" mb={4} mt={4}>
          Import Mumbai Network to Metamask
        </Heading>
        <MumbaiButton />
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

        <DeployMenu deployPMContract={deployPMContract} deployKUBIContract= {deployKUBIContract} deployKUBIXContract= {deployKUBIContract}/ >
        <MintMenu mintExecutiveNFT={mintExecutiveNFT}/>
        <DataMenu clearData={clearData}  handleAddHashes={handleAddHashes} />
      </Flex>
    </Flex>
  );
};

export default User;
