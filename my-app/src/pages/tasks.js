// pages/tasks.js

import React, { useRef } from 'react';
import { Box } from '@chakra-ui/react';
import MainLayout from '../components/TaskManager/MainLayout';
import FloatingBalls from '../components/TaskManager/floatingBalls';

const Tasks = () => {
  const containerRef = useRef();

  return (
    <Box p={0} minH="80vh" position="relative" bg="blackAlpha.600" ref={containerRef}>
      <FloatingBalls containerRef={containerRef} />
      <MainLayout />
    </Box>
  );
};

export default Tasks;
