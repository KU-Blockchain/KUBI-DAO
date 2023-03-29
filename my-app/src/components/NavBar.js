import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4}>
      <Flex justifyContent="space-around">
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
