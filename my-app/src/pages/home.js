import React from 'react';
import { Box, Flex, Heading, Text, Button, VStack, Container, Image } from '@chakra-ui/react';
import Link from 'next/link';
import User from './user.js';
 

const Home = () => {
  return (
    <VStack spacing={10}>
      <Box bg="blue.500" w="100%" py={20}>
        <Container centerContent>         
          <Heading as="h1" size="2xl" color="white">
            Welcome to KUBI DAO
          </Heading>
          <Text fontSize="xl" color="white" mt={5}>
            The University of Kansas Blockchain Institute's decentralized platform for collaboration and reward distribution
          </Text>
          <Link href="/user">
         <Button colorScheme="whiteAlpha" mt={8}>
              Get Started
         </Button>
          </Link>

        </Container>
      </Box>

      <Container centerContent>
        <VStack spacing={5}>
          <Heading as="h2" size="xl">
            About KUBI DAO
          </Heading>
          <Text fontSize="lg" textAlign="center">
            KUBIX DAO is a decentralized autonomous organization that offers a
            unique model for collaboration, incentives, and privileges. Our
            hybrid tokenomics system combines KUBIX and KUBI tokens to create a
            platform that encourages active participation and fair
            distribution of rewards.
          </Text>
        </VStack>
      </Container>
    </VStack>
  );
};

export default Home;
