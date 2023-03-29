import React from 'react';
import { Box } from '@chakra-ui/react';
import Home from './home';

export default function Index() {
  return (
    <Box p={8} minH="100vh" bg="gray.50">
      <Home />
    </Box>
  );
}

    