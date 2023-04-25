import React from 'react';
import { Box, Flex, Image, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Box bg="black" p={4}>
      <Flex alignItems="center" h="100%" maxH="62px" maxW={"100%"} justifyContent="space-between">
        <Box h="calc(100% - 6px)" w="auto"  mr={{ base: '4', md: '8' }}>
          <Image
            src="/images/KUBC-logo-RGB-1200.png"
            alt="KUBC Logo"
            h="100%"
            w="auto"
            maxW="140px"
          />
        </Box>
        <Flex justifyContent="space-between" flexGrow={1} ml={4} mr={4}>
          <Link as={NextLink} href="/" color="white" fontWeight="extrabold" mx={"2%"}> 
            Home
          </Link>
          <Link as={NextLink} href="/tasks" color="white" fontWeight="extrabold" mx={"2%"}>
            Tasks
          </Link>
          <Link as={NextLink} href="/Leaderboard" color="white" fontWeight="extrabold" mx={"2%"}>
            Leaderboard
          </Link>
          <Link as={NextLink} href="/voting" color="white" fontWeight="extrabold" mx={"2%"}>
            Voting
          </Link>
          <Link as={NextLink} href="/user" color="white" fontWeight="extrabold" mx={"2%"}>
            User
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
