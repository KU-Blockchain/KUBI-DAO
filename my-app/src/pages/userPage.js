import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Grid,
  GridItem,
  Text,
  IconButton,
  useColorMode,
  HStack,
  keyframes,
  usePrefersReducedMotion,
  chakra,
  Image,
  Progress,
  Spacer
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import CountUp from 'react-countup';

import imgNFT from '../../public/images/KUBC-logo-RGB-1200.png';

const glowAnimation = keyframes`
  from { text-shadow: 0 0 0px white; }
  to { text-shadow: 0 0 6px gold; }
`;

const progressBarAnimation = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const UserDashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [countFinished, setCountFinished] = useState(false);


  const glassLayerStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
    borderRadius: 'inherit',
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(0, 0, 0, .8)',
  };

  const userDetails = {
    name: 'User Name',
    kubixEarned: 1000,
    memberStatus: 'Member',
    joinDate: 'Dec 1, 1991',
    tier: 'Gold Tier Member',
    nextReward: 'Shirt',
  };

  const animationProps = prefersReducedMotion
    ? {}
    : {
        animation: `${glowAnimation} alternate 2.1s ease-in-out`,
      };


      const nextTierKUBIX = 1500;

    const progressPercentage = (userDetails.kubixEarned / nextTierKUBIX) * 100;


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
        <GridItem area={'welcome'}>
          <Text ml={2} letterSpacing="-1%" fontWeight="extrabold" fontSize="5xl">Welcome, {userDetails.name}</Text>
          
        </GridItem>
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
                <chakra.span {...animationProps}>{userDetails.kubixEarned}</chakra.span>

            ) : (
              <CountUp
                end={userDetails.kubixEarned}
                duration={1.7}
                onEnd={() => setCountFinished(true)}
                preserveValue
              />
            )}
          </Text>
            <Text pl={6} pb={6} fontSize="xl">This makes you top 1% of Contributors</Text>
          </VStack>
            <VStack p={6}  pt={8} align="center" >
                <Text fontSize="3xl" fontWeight="bold">{userDetails.tier}</Text>
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
                    <Text>({userDetails.kubixEarned}/{nextTierKUBIX})</Text>
                </HStack>
                <Spacer />
                <Button mt={6}colorScheme="blue">Upgrade Tier</Button>
            </VStack>
            <VStack p={6} align="flex-start" spacing={2}>
                <Text fontSize= "3xl" fontWeight="bold">Next Reward: {userDetails.nextReward}</Text>
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
          <Text  pl={4}  fontSize="3xl" fontWeight="extrabold">hudsonhrh </Text>
          <Text pt={2} pl={2} fontSize="lg" > {userDetails.memberStatus}</Text>
        </HStack>
          <IconButton
          icon={<SettingsIcon />}
          isRound={true}
          size="md"
          aria-label="Settings"
          onClick={toggleColorMode}
          alignSelf="start"
          justifySelf="end"
          position="absolute"
          top="8%"
          right="4%"
          color="black"
        />
        <HStack pb={4} pt={2}  spacing="25%">
            <VStack align={'flex-start'} ml="6%" spacing={1}>
                <Text mt={2}  fontWeight="bold" fontSize="md">Joined {userDetails.joinDate}</Text>
                <Text   fontWeight="bold" fontSize="md">Semester KUBIX: 4 {' '}</Text>
                <Text  fontWeight="bold" fontSize="md">Year KUBIX: 4 {' '}</Text>
                <Text  fontWeight="bold"  fontSize="md">Tasks Completed: 4 {' '}</Text>
            </VStack>
            <VStack align={'center'} spacing={2}>
                <Text fontWeight="extrabold" fontSize="lg">Menu</Text>
                <Button colorScheme="red" size="sm">Become Dev</Button>
                <Button colorScheme="purple" size="sm">Dev Menu</Button>
            </VStack>
            </HStack>
        </Box>
            <Text ml={6} fontWeight="bold" fontSize="2xl" pt={10}>Claimed Tasks: {' '}</Text>
            {/* Make into commpnent that grabs claimed task cards */}
            <HStack pb={6} ml={6} pt={4}>
                <Button colorScheme="green" size="md">Task 1</Button>
                <Button colorScheme="green" size="md">Task 2</Button>
                <Button colorScheme="green" size="md">Task 3</Button>
            </HStack>
            <Text ml={6} fontWeight="bold" fontSize="2xl" pt={10}>Reccomended Tasks: {' '}</Text>
            <HStack pb={6} ml={6} pt={4}>
                <Button colorScheme="green" size="md">Task 1</Button>
                <Button colorScheme="green" size="md">Task 2</Button>
                <Button colorScheme="green" size="md">Task 3</Button>
            </HStack>

            <Text ml={6} fontWeight="bold" fontSize="2xl" pt={10}>Ongoing Polls: {' '}</Text>
            <HStack pb={6} ml={6} pt={4}>
                <Button colorScheme="green" size="md">Task 1</Button>
                <Button colorScheme="green" size="md">Task 2</Button>
                <Button colorScheme="green" size="md">Task 3</Button>
            </HStack>
        

        </GridItem>
        
      </Grid>
    </Box>
  );
};

export default UserDashboard;
