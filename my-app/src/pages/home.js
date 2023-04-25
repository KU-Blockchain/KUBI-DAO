import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Container,
  Image,
} from '@chakra-ui/react';

import '../styles/TaskColumn.module.css';

const glassLayerStyle = {
  position: 'absolute',
  height: '100%',
  width: "100%",
  zIndex: -1,
  borderRadius: 'inherit',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, .6)',
};


const Home = () => {
  return (
    <VStack spacing={10}>
      <Box
       w="60%"
       mt="4%"
       borderRadius="2xl"
       display="flex"
       flexDirection="column"
       bg="transparent" // Set the background to transparent
       boxShadow="lg"
       position="relative" // Add position: 'relative'
       zIndex={1}
    >
      <div className="glass" style={glassLayerStyle} />
        <Container centerContent>
          <Heading as="h1" size="2xl" color="white"mt="4%">
            Welcome to KUBI DAO
          </Heading>
          <Text fontSize="2xl" color="white" mt={8}>
            The University of Kansas Blockchain Institute's decentralized platform for collaboration, voting, and reward distribution
          </Text>
          <Button size ="lg" bg="green.300" mt={10} mb="6%" _hover={{ bg: "green.500", boxShadow: "md", transform: "scale(1.05)"}}>
            Get Started
          </Button>
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

