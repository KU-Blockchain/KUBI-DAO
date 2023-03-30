import React, { useState } from 'react';
import { Box, VStack, Heading, Button, Input, FormControl } from '@chakra-ui/react';

const ProjectSidebar = ({ projects, onSelectProject, onCreateProject }) => {
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = () => {
    onCreateProject(newProjectName);
    setNewProjectName('');
  };

  return (
    <Box bg="gray.200" w="fit-content" h="100%" p={4} borderRight="1px" borderColor="gray.300">
      <Heading size="md" mb={4}>Projects</Heading>
      <VStack spacing={4} align="start">
        {projects.map((project) => (
          <Button key={project.id} onClick={() => onSelectProject(project.id)}>
            {project.name}
          </Button>
        ))}
        <FormControl>
          <Input
            placeholder="New project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
        </FormControl>
        <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
          Create Project
        </Button>
      </VStack>
    </Box>
  );
};

export default ProjectSidebar;
