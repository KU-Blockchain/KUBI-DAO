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
        <Link as={NextLink} href="/" color="white" fontWeight="extrabold">
          Home
        </Link>
        <Link as={NextLink} href="/tasks" color="white" fontWeight="extrabold">
          Tasks
        </Link>
        <Link as={NextLink} href="/leaderboard" color="white" fontWeight="extrabold">
          Leaderboard
        </Link>
        <Link as={NextLink} href="/voting" color="white" fontWeight="extrabold">
          Voting
        </Link>
        <Link as={NextLink} href="/user" color="white" fontWeight="extrabold">
          User
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;



