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
      <Flex direction={['row', 'row']} spacing={5}>
        <Box  p={5} shadow="md" borderWidth="1px" mb={[5, 5, 0]} mr={[0, 0, 5]}>
          <HStack justifyContent="space-between">
            <VStack align="flex-start">
              <Text fontWeight="extrabold" fontSize="3xl">Welcome, {userDetails.name}</Text>
              <HStack>
                <Text fontSize="2xl" fontWeight="bold">KUBIX Earned:</Text>
                <Text fontSize="2xl">{userDetails.kubixEarned}</Text>
                {/* Replace with actual coin logo */}
              </HStack>
              <Text>This makes you top 1% of Contributors</Text>
              <HStack>
                <Text fontWeight="bold">Member Status:</Text>
                <Text>{userDetails.memberStatus}</Text>
              </HStack>
              <Text>Joined {userDetails.joinDate}</Text>
            </VStack>
            <HStack spacing={4} mt={5}>
        <Button colorScheme="pink" size="md">Become Dev</Button>
        <Button colorScheme="purple" size="md">Dev Menu</Button>
      </HStack>

          </HStack>
        </Box>

        <Box flex="2" p={5} shadow="md" borderWidth="1px">
          <VStack align="flex-start">
            <Text fontSize="2xl" fontWeight="bold">{userDetails.tier}</Text>
            {/* Replace with actual NFT image */}
            <Button colorScheme="blue">Upgrade Tier</Button>
            <HStack justifyContent="space-between" width="full">
              <Text fontWeight="bold">Next Reward:</Text>
              <Text>{userDetails.nextReward}</Text>
            </HStack>
            <Button colorScheme="teal">Browse all</Button>
          </VStack>
        </Box>
      </Flex>


      <IconButton
              icon={<SettingsIcon />}
              isRound={true}
              size="lg"
              aria-label="Settings"
              onClick={toggleColorMode}
            />
    </Box>
  );
};

export default UserDashboard;
