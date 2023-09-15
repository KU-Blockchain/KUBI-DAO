import React, { useState, useEffect } from "react";
import KUBIMembershipNFTArtifact from "../abi/KUBIMembershipNFT.json";
import { useDataBaseContext } from "@/contexts/DataBaseContext";
import { useWeb3Context } from "@/contexts/Web3Context";
import { ethers } from "ethers";
import MumbaiButton from "../components/userPage/importMumbai";
import NFTButton from "@/components/userPage/importMemberNFT";
import { ScaleFade } from "@chakra-ui/react";
import NextLink from 'next/link';

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
  Link,
  VStack,
} from "@chakra-ui/react";

import KubixButton from "@/components/userPage/KubixButton";
import DeployMenu from "@/components/userPage/DeployMenu";
import MintMenu from "@/components/userPage/MintMenu";
import DataMenu from "@/components/userPage/DataMenu";


const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .6)",
};


const User = () => {
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const[showMetaMaskMessage, setShowMetaMaskMessage]=useState(false);



  const [isConnected, setIsConnected] = useState(false);
  const [isMember, setIsMember] = useState(false);



  const [loading,setLoading]=useState(false);

  const { userDetails, fetchUserDetails, addUserData } = useDataBaseContext();
  const{providerUniversal,signerUniversal, hasMemberNFT, execNftBalance,balance,nftBalance, fetchBalance,web3, account,kubiMembershipNFTContract, contract,KUBIXbalance, kubiMembershipNFTAddress}=useWeb3Context();


  
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





  const mintMembershipNFT = async () => {
    if (!kubiMembershipNFTContract) return;
    try {

      await kubiMembershipNFTContract.mintMembershipNFT(account, 2023, 0, "yes")

      toast({ title: "Success", description: "Successfully minted Membership NFT", status: "success", duration: 5000, isClosable: true });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Error minting Membership NFT", status: "error", duration: 5000, isClosable: true });
    }
  };



  const handleJoin = async (e) => {
    
    setShowMetaMaskMessage(true);
    setLoading(true)
  
    if (web3 && account) {
      console.log("inital")
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
        setLoading(false)
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
      setLoading(false)
      return;
    }
  
    try {
      console.log("checkUsername")
      const checkUsername = await addUserData(account, name, username, email);
      if (checkUsername !== true) {
        toast({
          title: "Error",
          description: "Username already exists",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false)
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
      setLoading(false)
      return;
    }
  
    if (!contract) return;
  
    try {
      console.log("minting")
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
      setLoading(false)
      return;
    }
  
    try {
      console.log("minting token")
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
  

  


  
  const renderJoinSteps = () => (
    <ScaleFade initialScale={0.8} in={true}>
      <VStack
        spacing={20}
        style={{ position: "relative", width: "100%", maxWidth: "1200px" }}
        color={"ghostwhite"}
      >
    {isConnected && !isMember && (
      
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius="lg"
          boxShadow="lg"
          display="flex"
          w="100%"
          maxWidth="600px"
          bg="transparent"
          position="relative"
          mr={6}
          p={6}
          zIndex={1}
          mt={4}
        >
          <div className="glass" style={glassLayerStyle} />

          <Heading  as="h2" size="lg" mb={6}>
            How To Join the DAO
          </Heading>
          <Text fontSize="xl"  mb={4}>1. If you haven't added the polygon Mumbai testnet import it below:</Text>
          <MumbaiButton />
          <Text  fontSize="xl" mt={4} mb={4}>2. Copy your wallet adress: </Text>
          <Text  >{account}</Text>
          <Text  fontSize="xl" mt={4} mb={4}>and paste it to get free MATIC <Link href="https://mumbaifaucet.com/" isExternal fontWeight="bold" textDecoration="underline" color="blue.500">here</Link></Text>
        
          <Text  fontSize="xl" mt={4} mb={4}>3. Import the KUBIX coin here:</Text>
          <KubixButton />
          <Text mt ={4}  fontSize="xl" >4. Make sure to switch to the mumbai Network at the top of Metamask </Text>
          <Text mt ={4}  mb="5%" fontSize="xl" >5. Put in your information to the right and confirm the minting transaction on Metamask.</Text>
        </Box>
        
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
            boxShadow="lg"
            w="100%"
            bg="transparent"
            position="relative"
            display="flex"
            p={6}
            zIndex={1}
            ml={6}
          >
             <div className="glass" style={glassLayerStyle} />
            <Heading as="h2" size="lg" mb={6} mt="4%" >
              Join KUBI DAO
            </Heading>
            <FormControl id="email" >
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
            <Button colorScheme="blue" mt={6} onClick={handleJoin} _hover={{ bg: "blue.600", boxShadow: "md", transform: "scale(1.05)"}}
            isLoading={loading}
            loadingText="Joining"
            >
              Join
            </Button>
            {showMetaMaskMessage && (
              <Text fontSize="xl" fontWeight="bold" color="red.500" mt={4}>
                Wait for MetaMask popup and confirm transaction
              </Text>)}
          </Box>
          </Flex>
         
        )}
      </VStack>
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
          bg="transparent"
          position="relative"
          display="flex"
          zIndex={0}
          color= "ghostwhite"
        >
          <div className="glass" style={glassLayerStyle} />
          <Heading as="h2" size="lg" mb={4}>
            KUBI User Dashboard
          </Heading>
          {web3 && (
          <Text color="green.400" fontWeight="extrabold">

            Wallet Connected
          </Text>
        )}
        <Text mt={4} fontWeight="extrabold">Username: {userDetails && userDetails.username}</Text>
        <Text mt= {4}>Account:</Text>
        <Text>{account}</Text>
        <Text fontWeight="bold" mt={4}>KUBI Token Balance: {balance}</Text>
        <Text fontWeight="bold">KUBIX Token Balance: {KUBIXbalance}</Text>
        <Text fontWeight="bold">Membership NFT Balance: {nftBalance}</Text>
        <Text fontWeight="bold">Executive NFT Balance: {execNftBalance}</Text>
        

        </Flex>
      )}
    </>
    </ScaleFade>
  );

  const renderMetamaskMessage = () => (
    <ScaleFade initialScale={0.8} in={true}>
    <>
      {!isConnected && (
        <Text fontSize="3xl" fontWeight="extrabold" color="black" mt="15%">
          Please refresh with Metamask. If you don't have Metamask, please install it <Link href="https://metamask.io/" isExternal fontWeight="bold" textDecoration="underline" color="ghostwhite">here</Link>
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
        maxWidth="400px"
        bg="transparent"
        zIndex={1}
        position="relative" 
        display="flex"
        
      >
        <div className="glass" style={glassLayerStyle} />

        <Heading color = "ghostwhite" as="h2" size="lg" mb={6}>
            Developer Menu
        </Heading>

        <DeployMenu / >
        <MintMenu />
        <DataMenu />
        <Button mt ={4} colorScheme="purple" _hover={{ bg: "purple.600", boxShadow: "md", transform: "scale(1.05)"}}>
        <Link as={NextLink} href="/practice" color="white" fontWeight="bold" fontSize="l" mx={"2%"}> 
            Practice
          </Link>
        </Button>
      </Flex>
      )}
  </>


  );

  return (
    
    <Flex
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="center"
      p={8}
      w="100%"
      h="100%"
      bg="#1285ff"
      minH="100vh"
    >
      {renderMetamaskMessage()}
      {renderDashboard()}
      {renderDevMenu()}
      {renderJoinSteps()}

    </Flex>
    
  );
};

export default User;
