import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Navbar = () => {
  return (
    <Box bg="black" p={4}>
      <Flex  alignItems="center" h="100%" maxH="62px"> {/* Change justifyContent to "space-between" */}
        <Box h="calc(100% - 6px)" w="auto" maxW="8%" mr={{ base: '4', md: '8' }}>
          <Image
            src="/images/KUBC-logo-RGB-1200.png"
            alt="KUBC Logo"
            h="100%"
            w="auto"
          />
        </Box>
        <Flex> 
          <Link as={NextLink} href="/" color="white" fontWeight="extrabold" mx={"45%"}> 
            Home
          </Link>
          <Link as={NextLink} href="/tasks" color="white" fontWeight="extrabold" mx={"45%"}>
            Tasks
          </Link>
          <Link as={NextLink} href="/Leaderboard" color="white" fontWeight="extrabold" mx={"45%"}>
            Leaderboard
          </Link>
          <Link as={NextLink} href="/voting" color="white" fontWeight="extrabold" mx={"45%"}>
            Voting
          </Link>
          <Link as={NextLink} href="/user" color="white" fontWeight="extrabold" mx={"45%"}>
            User
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
