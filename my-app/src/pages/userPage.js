import React from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Flex,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

const UserDashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const userDetails = {
    name: 'User Name',
    kubixEarned: 1000,
    memberStatus: 'Normal',
    joinDate: 'Dec 1, 1991',
    tier: 'Gold Tier',
    nextReward: 'Shirt',
  };

  return (
    <Box p={5}>
      <Flex direction={['row', 'row', 'row']} spacing={5}>
        <Box  p={5}  mb={[5, 5, 0]} mr={[0, 0, 5]}>
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Text fontWeight="extrabold" fontSize="5xl">Welcome, {userDetails.name}</Text>
              <HStack>
                <Text fontSize="3xl" fontWeight="bold">KUBIX Earned:</Text>
                <Text fontSize="2xl">{userDetails.kubixEarned}</Text>
                {/* Replace with actual coin logo */}
              </HStack>
              <Text>This makes you top 1% of Contributors</Text>
              <HStack>
                <Text fontWeight="bold">Member Status:</Text>
                <Text>{userDetails.memberStatus}</Text>
              </HStack>
              <Text>Joined {userDetails.joinDate}</Text>
              <HStack spacing={4} mt={5}>
                    <Button colorScheme="pink" size="md">Become Dev</Button>
                    <Button colorScheme="purple" size="md">Dev Menu</Button>
                </HStack>
            </VStack>


        </HStack>
    </Box>

        <Box flex="2" p={5} >
          <VStack align="center">
            <Text fontSize="2xl" fontWeight="bold">{userDetails.tier}</Text>
            {/* Replace with actual NFT image */}
            <Button colorScheme="blue">Upgrade Tier</Button>
            <HStack justifyContent="center" width="full">
              <Text fontWeight="bold">Next Reward: Shirt</Text>
            </HStack>
            <Button colorScheme="teal">Browse all</Button>
          </VStack>
        </Box>
        <IconButton
              icon={<SettingsIcon />}
              isRound={true}
              size="lg"
              aria-label="Settings"
              onClick={toggleColorMode}
            />
      </Flex>



    </Box>
  );
};

export default UserDashboard;
