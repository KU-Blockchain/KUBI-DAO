// src/components/ProjectSidebar.js
import React from 'react';
import { Box, VStack, Heading, Button } from '@chakra-ui/react';

const ProjectSidebar = ({ projects, onSelectProject }) => {
  return (
    <Box bg="gray.200" w="300px" h="100vh" p={4} borderRight="1px" borderColor="gray.300">
      <Heading size="md" mb={4}>Projects</Heading>
      <VStack spacing={4} align="start">
        {projects.map((project) => (
          <Button key={project.id} onClick={() => onSelectProject(project.id)}>
            {project.name}
          </Button>
        ))}
      </VStack>
    </Box>
  );
};

export default ProjectSidebar;
