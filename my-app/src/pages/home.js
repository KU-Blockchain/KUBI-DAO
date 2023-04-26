import React from 'react';
import '../styles/TaskColumn.module.css';
import { Box, Flex, Heading, Text, Button, VStack, Container, Image, Link } from '@chakra-ui/react';
import Link2 from 'next/link';

const glassLayerStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
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
        bg="transparent"
        boxShadow="lg"
        position="relative"
        zIndex={1}
      >
        <div className="glass" style={glassLayerStyle} />
          <Container centerContent>
            <Heading as="h1" size="2xl" color="white" mt="4%">
              Welcome to KUBI DAO
            </Heading>
            <Text fontSize="2xl" color="white" mt={8}>
              The University of Kansas Blockchain Institute's decentralized platform for collaboration, voting, and reward distribution
            </Text>

            <Link2 href="/user">
              <Button size="lg" bg="green.300" mt={10} mb="10" _hover={{ bg: "green.500", boxShadow: "md", transform: "scale(1.05)" }}>
                Get Started
              </Button>
            </Link2>
          </Container>
      </Box>

      <Box
        w="40%"
        mt="4%"
        borderRadius="2xl"
        display="flex"
        flexDirection="column"
        bg="transparent"
        boxShadow="lg"
        position="relative"
        zIndex={1}
      >
        <div className="glass" style={glassLayerStyle} />
        <Container centerContent>
          
            <Heading mt="2%" color= "ghostwhite" as="h2" size="xl">
              About KUBI DAO
            </Heading>
            <Text mt="4%" color= "ghostwhite" fontSize="lg" textAlign="center">
              KUBI DAO is a decentralized autonomous organization that offers a
              unique model for collaboration, incentives, and privileges. Our
              hybrid tokenomics system combines KUBIX and KUBI tokens to create a
              platform that encourages active participation and fair
              distribution of rewards.
            </Text>

            <Text mt="4%" mb="4%" color= "ghostwhite" fontSize="2xl" textAlign="center" fontWeight={900}>
              Read more here at our github readme <Link href="https://github.com/KU-Blockchain/DAO2#readme" isExternal fontWeight="bold" textDecoration="underline" color="white">here</Link>
            </Text>
        </Container>
        </Box>
    </VStack>

  );
};

export default Home;
