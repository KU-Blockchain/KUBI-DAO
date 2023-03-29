// src/components/Navbar.js
import React from 'react';
import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4}>
      <Flex justifyContent="space-around">
        <NextLink href="/" passHref>
          <Link color="white" fontWeight="bold">Home</Link>
        </NextLink>
        <NextLink href="/tasks" passHref>
          <Link color="white" fontWeight="bold">Tasks</Link>
        </NextLink>
        <NextLink href="/leaderboard" passHref>
          <Link color="white" fontWeight="bold">Leaderboard</Link>
        </NextLink>
        <NextLink href="/voting" passHref>
          <Link color="white" fontWeight="bold">Voting</Link>
        </NextLink>
        <NextLink href="/user" passHref>
          <Link color="white" fontWeight="bold">User</Link>
        </NextLink>
      </Flex>
    </Box>
  );
};

export default Navbar;
