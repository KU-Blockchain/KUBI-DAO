import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Grid,
  GridItem,
  Text,
  IconButton,
  HStack,
  keyframes,
  usePrefersReducedMotion,
  chakra,
  Image,
  Progress,
  Spacer,
  Flex,
  Link
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import CountUp from 'react-countup';
import AccountSettingsModal from '@/components/userPage/AccountSettingsModal';
import NextLink from 'next/link';

import { useWeb3Context } from '@/contexts/Web3Context';
import { useDataBaseContext } from '@/contexts/DataBaseContext';

import DeployMenu from "@/components/userPage/DeployMenu";
import MintMenu from "@/components/userPage/MintMenu";
import DataMenu from "@/components/userPage/DataMenu";



const glowAnimation = keyframes`
  from { text-shadow: 0 0 0px white; }
  to { text-shadow: 0 0 6px gold; }
`;

const progressBarAnimation = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const renderDevMenu = () => (
    <>

        <DeployMenu />
        <MintMenu />
        <DataMenu />
        <Button mt ={4} colorScheme="purple" _hover={{ bg: "purple.600", boxShadow: "md", transform: "scale(1.05)"}}>
        <Link as={NextLink} href="/practice" color="white" fontWeight="bold" fontSize="l" mx={"2%"}> 
            Practice
          </Link>
        </Button>
  </>
  );

const UserPage= () => {
    
  const prefersReducedMotion = usePrefersReducedMotion();
  const [countFinished, setCountFinished] = useState(false);

  const[upgradeAvailable, setUpgradeAvailable] = useState(false);

  const [showDevMenu, setShowDevMenu] = useState(false);

  const toggleDevMenu = () => {
    setShowDevMenu(prevShowDevMenu => !prevShowDevMenu);
};

  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  const openSettingsModal = () => setSettingsModalOpen(true);
  const closeSettingsModal = () => setSettingsModalOpen(false);


    const { web3, account,KUBIXbalance, hasExecNFT} = useWeb3Context();
    const {userDetails, fetchUserDetails} = useDataBaseContext();

    useEffect(() => {
        async function fetch(){
            await fetchUserDetails(web3,account);
            
        }
        fetch();
        
        
      }, [web3, account]);

    


  const glassLayerStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
    borderRadius: 'inherit',
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(0, 0, 0, .8)',
  };

  const userInfo = {
    username: userDetails && userDetails.username ? userDetails.username : 'User',
    kubixEarned: KUBIXbalance,
    memberStatus: hasExecNFT ? 'Executive' : 'Member',
    semesterKubix: userDetails && userDetails.kubixBalance2024Spring ? userDetails.kubixBalance2024Spring : 0,
    yearKubix: userDetails && userDetails.kubixBalance2024Spring && userDetails.kubixBalance2023Fall ? userDetails.kubixBalance2023Fall+ userDetails.kubixBalance2024Spring : 0,
    accountAddress: account ? account : '0x000',
    tier: 'Gold Tier Member',
    nextReward: 'Shirt',
    tasksCompleted: userDetails && userDetails.tasksCompleted ? userDetails.tasksCompleted : 0,
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        animation: `${glowAnimation} alternate 2.1s ease-in-out`,
      };


      const nextTierKUBIX = 1500;

    let progressPercentage = (userInfo.kubixEarned / nextTierKUBIX) * 100;
    console.log(userDetails);

    useEffect(() => {
        if ((userInfo.kubixEarned / nextTierKUBIX) * 100 > 100) {
          setUpgradeAvailable(true);
          progressPercentage = 100;
        }
      }, [userInfo.kubixEarned, nextTierKUBIX]);


    const getProgressBarAnimation = (percentage) => keyframes`
        0% { width: 0%; }
        100% { width: ${percentage}%; }
    `;

    const progressAnimation = prefersReducedMotion
    ? {}
    : {
        animation: `${getProgressBarAnimation(progressPercentage)} 2s ease-out forwards`,
      };
  return (
    <Box p={4}>
      <Grid
        color="white"
        templateAreas={[
          `'welcome welcome' 'userinfo tierinfo' 'userinfo tierinfo'`,
          `'welcome welcome' 'userinfo tierinfo' 'userinfo tierinfo'`
        ]}
        templateColumns="repeat(2, 1fr)"
        gap={4}
      >

        <GridItem area={'userinfo'}>
        <Box
            w="100%"
            borderRadius="2xl"
            bg="transparent"
            boxShadow="lg"
            position="relative"
            zIndex={2}
            
          >
        <div style={glassLayerStyle} />
          <VStack position="relative" borderTopRadius="2xl" align="flex-start">
          <div style={glassLayerStyle} />
            <Text pl={6} letterSpacing="-1%" mt={2} fontSize="4xl" id="kubix-earned" fontWeight="bold">KUBIX Earned: {' '}
            {countFinished ? (
                <chakra.span {...animationProps}>{userInfo.kubixEarned}</chakra.span>

            ) : (
              <CountUp
                end={userInfo.kubixEarned}
                duration={1.7}
                onEnd={() => setCountFinished(true)}
                preserveValue
              />
            )}
          </Text>
            <Text pl={6} pb={6} fontSize="xl">This makes you top 1% of Contributors</Text>
          </VStack>
            <VStack p={6}  pt={6} align="center" >
                <Text fontSize="3xl" fontWeight="bold">{userInfo.tier}</Text>
                <Image src="/images/KUBC-logo-RGB-1200.png" alt="KUBC Logo"  maxW="50%" />
                <Progress
                    value={progressPercentage}
                    max={100} 
                    width="70%"
                    colorScheme="green"
                    height="20px"
                    borderRadius="md"
                    sx={{
                        '& > div': {
                        ...progressAnimation,
                        },
                    }}
                    
                    />

                
                <HStack>
                    <Text fontSize="xl" fontWeight="bold">Next Tier: Diamond</Text>
                    <Text>({userInfo.kubixEarned}/{nextTierKUBIX})</Text>
                </HStack>
                <Spacer />
                {upgradeAvailable && (
                <Button mt={6}colorScheme="blue">Upgrade Tier</Button>)}
            </VStack>
            <VStack  pl={6} pb={4} align="flex-start" spacing={2}>
                <Text fontSize= "3xl" fontWeight="bold">Next Reward: Coming Soon...</Text>
                <Button colorScheme="teal">Browse all</Button>
            </VStack>

        </Box>
        </GridItem>
        <GridItem area={'tierinfo'}>
        <Box
            w="100%"
            borderRadius="2xl"
            bg="transparent"
            boxShadow="lg"
            position="relative"
            zIndex={2}
            
          >
        <div style={glassLayerStyle} />
        <HStack  pt={4} pb= {4} position="relative" borderTopRadius="2xl" >
        <div style={glassLayerStyle} />
          <Text  pl={4}  fontSize="3xl" fontWeight="extrabold">{userInfo.username} </Text>
          <Text pt={2} pl={2} fontSize="lg" > {userInfo.memberStatus}</Text>
        </HStack>
          <IconButton
          icon={<SettingsIcon />}
          isRound={true}
          size="md"
          aria-label="Settings"
          onClick={openSettingsModal}
          alignSelf="start"
          justifySelf="end"
          position="absolute"
          top="8%"
          right="4%"
          color="black"
        />
        
        <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
      />
        <HStack pb={4} pt={2}  spacing="27%">
            <VStack align={'flex-start'} ml="6%" spacing={1}>
                <Text   fontWeight="bold" fontSize="md">Semester KUBIX: {userInfo.semesterKubix}</Text>
                <Text  fontWeight="bold" fontSize="md">Year KUBIX: {userInfo.yearKubix}</Text>
                <Text  fontWeight="bold"  fontSize="md">Tasks Completed: {userInfo.tasksCompleted}</Text>
            </VStack>
            <VStack align={'center'} spacing={2}>

                <Text fontWeight="extrabold" fontSize="lg">Menu</Text>
                {hasExecNFT && (
                <Button colorScheme="green" onClick={toggleDevMenu} size="sm">Dev Menu</Button>
                )}
                {!hasExecNFT &&(<Button colorScheme="red" size="sm">Become Dev</Button>)}
                {showDevMenu && (
                <>
                    <DeployMenu />
                    <MintMenu />
                    <DataMenu />
                </>
            )}
               
            </VStack>
            </HStack>
        </Box>
        <Box w="100%"
            pt={4}
            borderRadius="2xl"
            bg="transparent"
            boxShadow="lg"
            position="relative"
            zIndex={2}>
        <div style={glassLayerStyle} />
        
            <Text ml={6} fontWeight="bold" fontSize="2xl" pt={4}>Claimed Tasks {' '}</Text>
            {/* Make into commpnent that grabs claimed task cards */}
            <HStack pb={6} ml={6} pt={4}>
                <Button colorScheme="green" size="md">Task 1</Button>
                <Button colorScheme="green" size="md">Task 2</Button>
                <Button colorScheme="green" size="md">Task 3</Button>
            </HStack>
            <Text ml={6} fontWeight="bold" fontSize="2xl" pt={10}>Reccomended Tasks {' '}</Text>
            <HStack pb={6} ml={6} pt={4}>
                <Button colorScheme="green" size="md">Task 1</Button>
                <Button colorScheme="green" size="md">Task 2</Button>
                <Button colorScheme="green" size="md">Task 3</Button>
            </HStack>
            </Box>
            <Box w="100%"
            pt={8}
            borderRadius="2xl"
            bg="transparent"
            boxShadow="lg"
            position="relative"
            zIndex={2}>
        <div style={glassLayerStyle} />

            <Text ml={6} fontWeight="bold" fontSize="2xl" pt={4}>Ongoing Polls {' '}</Text>
            <HStack pb={6} ml={6} pt={4}>
                <Button colorScheme="green" size="md">Task 1</Button>
                <Button colorScheme="green" size="md">Task 2</Button>
                <Button colorScheme="green" size="md">Task 3</Button>
            </HStack>
        </Box>
        

        </GridItem>
        
      </Grid>
    </Box>
  );
};

export default UserPage;
