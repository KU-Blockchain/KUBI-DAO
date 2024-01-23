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
    <Box p={5}>
      <Grid
        color="white"
        templateAreas={[
          `'welcome welcome' 'userinfo tierinfo' 'userinfo tierinfo'`,
          `'welcome welcome' 'userinfo tierinfo' 'userinfo tierinfo'`
        ]}
        templateColumns="repeat(2, 1fr)"
        gap={6}
      >
        <GridItem area={'welcome'}>
          <Text fontWeight="extrabold" fontSize="5xl">Welcome, {userDetails.name}</Text>
          <IconButton
          icon={<SettingsIcon />}
          isRound={true}
          size="lg"
          aria-label="Settings"
          onClick={toggleColorMode}
          alignSelf="start"
          justifySelf="end"
          position="absolute"
          top="12%"
          right={8}
          color="black"
        />
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
          <VStack  ml={6} align="flex-start" spacing={0}>
            <Text mt={2} fontSize="4xl" id="kubix-earned" fontWeight="bold">KUBIX Earned: {' '}
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
            <Text fontSize="xl">This makes you top 1% of Contributors</Text>
          </VStack>
            <VStack p={6}  pt={14} align="center" >
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
          
          <Text fontSize="2xl" fontWeight="bold">{userDetails.memberStatus}</Text>
            <Text fontSize="xl">Joined {userDetails.joinDate}</Text>
            <HStack pt={4}>
                <Button colorScheme="pink" size="md">Become Dev</Button>
                <Button colorScheme="purple" size="md">Dev Menu</Button>
            </HStack>
            <Text fontWeight="bold" fontSize="2xl" pt={10}>Current Tasks: {' '}</Text>
            {/* Make into commpnent that grabs claimed task cards */}
            <HStack pt={4}>
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
