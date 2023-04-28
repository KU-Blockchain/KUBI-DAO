import { useState, useEffect } from "react";
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import ProjectManagerArtifact from "../abi/ProjectManager.json";
import ExecNFTArtifiact from "../abi/KUBIExecutiveNFT.json";
import KUBIXArtifact from "../abi/KUBIX.json";
import { useDataBaseContext } from "@/contexts/DataBaseContext";
import { useWeb3Context } from "@/contexts/Web3Context";
import { ethers } from "ethers";
import MumbaiButton from "../components/userPage/importMumbai";
import { ScaleFade } from "@chakra-ui/react";


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
  Link
} from "@chakra-ui/react";

import KubixButton from "@/components/userPage/KubixButton";
import DeployMenu from "@/components/userPage/DeployMenu";
import MintMenu from "@/components/userPage/MintMenu";
import DataMenu from "@/components/userPage/DataMenu";



const User = () => {
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const[showMetaMaskMessage, setShowMetaMaskMessage]=useState(false);

  //move deploys to deploy menu component
  const [deployedPMContract, setDeployedPMContract] = useState(null);
  const [deployedKUBIContract, setDeployedKUBIContract] = useState(null);
  const [deployedKUBIXContract, setDeployedKUBIXContract] = useState(null);


  const [isConnected, setIsConnected] = useState(false);
  const [isMember, setIsMember] = useState(false);


  const [showDataMenu, setShowDataMenu] = useState(false);
  const [projectHashesInput, setProjectHashesInput] = useState([]);
  const [dataHashInput, setDataHashInput] = useState("");
  const [phrase,setPhrase]=useState("Join");

  const { userDetails, setUserDetails,  setAccount, fetchUserDetails, addUserData, clearData, pushProjectHashes } = useDataBaseContext();
  const{hasMemberNFT, execNftContract,execNftBalance,balance,nftBalance, fetchBalance,web3, account,kubiMembershipNFTContract, contract,KUBIXbalance,KUBIXcontract, KUBIXcontractAddress, contractAddress, kubiMembershipNFTAddress,KUBIExecutiveNFTAddress}=useWeb3Context();


  
  const toast = useToast();

  

  useEffect(() => {
    fetchUserDetails(web3,account);
  }, [web3, account]);

  useEffect(() => {
    const checkConnection = async () => {
      if (web3 && account) {
        setIsConnected(true);
        if (hasMemberNFT){
          setIsMember(true);
        }
      } else {
        setIsConnected(false);
        setIsMember(false);
      }
    };

    checkConnection();
  }, [web3, account, hasMemberNFT]);
  


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



  const handleJoin = async (e) => {
    setPhrase("Joining...");
    setShowMetaMaskMessage(true);
    e.target.disabled = true;
  
    if (web3 && account) {
      const networkId = await web3.eth.net.getId();
      if (networkId !== 80001) {
        // Polygon Mumbai Network ID
        toast({
          title: "Wrong network",
          description: "Please switch to the Polygon Mumbai Network",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setPhrase("Join");
        e.target.disabled = false;
        return;
      }
    }
  
    if (!email.endsWith("@ku.edu")) {
      toast({
        title: "Invalid email domain",
        description: "Please use a valid @ku.edu email",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setPhrase("Join");
      e.target.disabled = false;
      return;
    }
  
    try {
      const checkUsername = await addUserData(account, name, username, email);
      if (checkUsername !== true) {
        toast({
          title: "Error",
          description: "Username already exists",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setPhrase("Join");
        e.target.disabled = false;
        return;
      }
  
      toast({
        title: "Success",
        description: "Successfully added user information",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error adding user information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setPhrase("Join");
      e.target.disabled = false;
      return;
    }
  
    if (!contract) return;
  
    try {
      await mintMembershipNFT();
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
      setPhrase("Join");
      e.target.disabled = false;
      return;
    }
  
    try {
      await contract.methods.mint().send({ from: account });
      const newBalance = await contract.methods.balanceOf(account).call();
      fetchBalance();
      toast({
        title: "Success",
        description: `Successfully minted ${newBalance} tokens`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error minting tokens",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  
    setPhrase("Join");
    e.target.disabled = false;
  };
  

  

  const handleAddHashes = async () => {
    if (projectHashesInput.length === 0 || dataHashInput === "") {
      // Show error message if the inputs are not valid
      return;
    }
  
    await pushProjectHashes(projectHashesInput, dataHashInput);
  };
  
  const renderJoinSteps = () => (
    <ScaleFade initialScale={0.8} in={true}>
    <>
    {isConnected && !isMember && (
      
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius="lg"
          boxShadow="lg"
          p={6}
          w="100%"
          maxWidth="600px"
          bg="gray.50"
          mr={4}
        >
          <Heading as="h2" size="lg" mb={6}>
            How To Join the DAO
          </Heading>
          <Text fontSize="xl" mb={4}>1. If you haven't added the polygon Mumbai testnet import it below:</Text>
          <MumbaiButton />
          <Text fontSize="xl" mt={4} mb={4}>2. Get some free testnet MATIC by pasting your wallet adress <Link href="https://faucet.polygon.technology/" isExternal fontWeight="bold" textDecoration="underline" color="blue.500">here</Link></Text>
          <Text fontWeight ="bold" mt= {4}>Wallet Adress for copying:</Text>
          <Text>{account}</Text>
          <Text fontSize="xl" mt={4} mb={4}>3. Import the KUBIX coin here:</Text>
          <KubixButton />
          <Text mt ={4} fontSize="xl" >4. Make sure to switch to the mumbai Network at the top of Metamask </Text>
          <Text mt ={4} fontSize="xl" >5. Put in your information to the right and confirm the minting transaction on Metamask.</Text>
        </Box>
        
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
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
            <Button colorScheme="blue" mt={4} onClick={handleJoin} _hover={{ bg: "blue.600", boxShadow: "md", transform: "scale(1.05)"}}>
              {phrase}
            </Button>
            {showMetaMaskMessage && (
              <Text fontSize="xl" fontWeight="bold" color="red.500" mt={4}>
                Wait for MetaMask popup and confirm transaction
              </Text>)}
          </Box>
          </Flex>
         
        )}
        </>
        </ScaleFade>
   );
  
  const renderDashboard = () => (
    <ScaleFade initialScale={0.8} in={true}>
    <>
      {isConnected && isMember && (
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
      )}
    </>
    </ScaleFade>
  );

  const renderMetamaskMessage = () => (
    <ScaleFade initialScale={0.8} in={true}>
    <>
      {!isConnected && (
        <Text fontSize="xl" fontWeight="bold" color="red.500">
          Please refresh with Metamask. If you don't have Metamask, please install it <Link href="https://metamask.io/" isExternal fontWeight="bold" textDecoration="underline" color="blue.500">here</Link>
        </Text>
      )}
    </>
    </ScaleFade>
  );
  const renderDevMenu = () => (
    <>
      {isConnected && isMember && (
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

        <DeployMenu deployPMContract={deployPMContract} deployKUBIContract= {deployKUBIContract} deployKUBIXContract= {deployKUBIXContract}/ >
        <MintMenu />
        <DataMenu clearData={clearData}  handleAddHashes={handleAddHashes} />
      </Flex>
      )}
  </>


  );

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
      {renderMetamaskMessage()}
      {renderDashboard()}
      {renderDevMenu()}
      {renderJoinSteps()}

    </Flex>
    
  );
};

export default User;
