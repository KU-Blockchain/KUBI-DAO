import React from 'react';
import { Box } from '@chakra-ui/react';
import MainLayout from '../components/TaskManager/MainLayout';

const Tasks = () => {
  return (
    <Box p={0} minH="80vh" bg="blue.100">
      <MainLayout />
    </Box>
  );
};

export default Tasks;

