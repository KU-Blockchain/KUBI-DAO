import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4}>
      <Flex justifyContent="space-around">
        <NextLink href="/" passHref>
          <Button as="a" color="white" fontWeight="bold">Home</Button>
        </NextLink>
        <NextLink href="/tasks" passHref>
          <Button as="a" color="white" fontWeight="bold">Tasks</Button>
        </NextLink>
        <NextLink href="/leaderboard" passHref>
          <Button as="a" color="white" fontWeight="bold">Leaderboard</Button>
        </NextLink>
        <NextLink href="/voting" passHref>
          <Button as="a" color="white" fontWeight="bold">Voting</Button>
        </NextLink>
        <NextLink href="/user" passHref>
          <Button as="a" color="white" fontWeight="bold">User</Button>
        </NextLink>
      </Flex>
    </Box>
  );
};

export default Navbar;

