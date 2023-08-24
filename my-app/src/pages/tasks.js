// pages/tasks.js

import React, { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import MainLayout from '../components/TaskManager/MainLayout';
import FloatingBalls from '../components/TaskManager/floatingBalls';
import { useDataBaseContext } from '@/contexts/DataBaseContext';

const Tasks = () => {
  const {setTaskLoaded} = useDataBaseContext();
  const containerRef = useRef();

  useEffect(() => {
    setTaskLoaded(true);
  }, []);

  return (
    <Box p={0} minH="80vh" position="relative" bg="blackAlpha.600" ref={containerRef}>
      <FloatingBalls containerRef={containerRef} />
      <MainLayout />
    </Box>
  );
};

export default Tasks;
