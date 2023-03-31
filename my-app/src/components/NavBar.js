import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4}>
      <Flex justifyContent="space-around" alignItems="center" h="100%" maxH="64px">
        <Box h="calc(100% - 6px)" w="auto" maxW="6%" mr={{ base: '4', md: '8' }}>
          <Image
            src="/images/simple-logo-white-smaller.png"
            alt="KUBC Logo"
            h="100%"
            w="auto"
            objectFit="contain"
          />
        </Box>
        <Link as={NextLink} href="/" color="white" fontWeight="bold">
          Home
        </Link>
        <Link as={NextLink} href="/tasks" color="white" fontWeight="bold">
          Tasks
        </Link>
        <Link as={NextLink} href="/leaderboard" color="white" fontWeight="bold">
          Leaderboard
        </Link>
        <Link as={NextLink} href="/voting" color="white" fontWeight="bold">
          Voting
        </Link>
        <Link as={NextLink} href="/user" color="white" fontWeight="bold">
          User
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;



