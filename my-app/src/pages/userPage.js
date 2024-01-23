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
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import CountUp from 'react-countup';

const glowAnimation = keyframes`
  from { text-shadow: 0 0 0px white; }
  to { text-shadow: 0 0 5px white; }
`;

const UserDashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [countFinished, setCountFinished] = useState(false);

  const userDetails = {
    name: 'User Name',
    kubixEarned: 1000,
    memberStatus: 'Member',
    joinDate: 'Dec 1, 1991',
    tier: 'Gold Tier Member',
    nextReward: 'Shirt',
  };

  // Chakra UI animation props
  const animationProps = prefersReducedMotion
    ? {}
    : {
        animation: `${glowAnimation} alternate 2.1s ease-in-out`,
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
          <Text fontWeight="extrabold" fontSize="6xl">Welcome, {userDetails.name}</Text>
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
          right={5}
          color="black"
        />
        </GridItem>
        <GridItem area={'userinfo'}>
          <VStack align="flex-start" spacing={0}>
            <Text fontSize="4xl" id="kubix-earned" fontWeight="bold">KUBIX Earned: {' '}
            {countFinished ? (
              <chakra.span {...animationProps}>{userDetails.kubixEarned}</chakra.span>
            ) : (
              <CountUp
                end={userDetails.kubixEarned}
                duration={1.5}
                onEnd={() => setCountFinished(true)}
                preserveValue
              />
            )}
          </Text>
            <Text fontSize="xl">This makes you top 1% of Contributors</Text>
          </VStack>
          <VStack pt={20} align="flex-start" spacing={4}>
            <Text fontSize="2xl" fontWeight="bold">{userDetails.tier}</Text>
            <Button colorScheme="blue">Upgrade Tier</Button>
            <Text fontWeight="bold">Next Reward: {userDetails.nextReward}</Text>
            <Button colorScheme="teal">Browse all</Button>
          </VStack>
        </GridItem>
        <GridItem area={'tierinfo'}>
          
          <Text fontSize="2xl" fontWeight="bold">{userDetails.memberStatus}</Text>
            <Text fontSize="xl">Joined {userDetails.joinDate}</Text>
            <HStack pt={4}>
                <Button colorScheme="pink" size="md">Become Dev</Button>
                <Button colorScheme="purple" size="md">Dev Menu</Button>
            </HStack>
            <Text fontWeight="bold" fontSize="2xl" pt={10}>Current Tasks: {' '}</Text>
        </GridItem>
        
      </Grid>
    </Box>
  );
};

export default UserDashboard;
