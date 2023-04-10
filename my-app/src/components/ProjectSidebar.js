import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  Input,
  FormControl,
  Spacer,
  Flex,
} from '@chakra-ui/react';
import { useWeb3Context } from '../contexts/Web3Context';

const ProjectSidebar = ({ projects,selectedProject, onSelectProject, onCreateProject }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { hasExecNFT} = useWeb3Context();
  
  const handleCreateProject = () => {
    
      if (hasExecNFT) {
        onCreateProject(newProjectName);
        setNewProjectName('');
        setShowInput(false);
      } else {
         alert('You must be an executive to create project');
         setNewProjectName('');
         setShowInput(false);
      }

  };

  return (
    <Box
      bg="gray.200"
      w="300px"
      h="100vh"
      p={4}
      borderRight="1px"
      borderColor="gray.300"
      display="flex"
      flexDirection="column"
    >
      <Heading size="md" mb={4}>
        Projects
        </Heading>
      <Box flexGrow={1} overflowY="auto" pr={4}>
        <VStack spacing={4} align="start">
          {projects.map((project) => {
            const isSelected = selectedProject && project.id === selectedProject.id;

            return (
              <Button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                width="100%"
                bg={isSelected ? "gray.300" : undefined}
              >
                {project.name}
              </Button>
            );
          })}
        </VStack>
      </Box>
      <Spacer />
      <Flex direction="column" mt={4}>
        {showInput && (
          <FormControl>
            <Input
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
          </FormControl>
        )}
        <Button
          mt={2}
          onClick={showInput ? handleCreateProject : () => setShowInput(true)}
          disabled={showInput && !newProjectName.trim()}
          width="100%" // Set width to 100%
        >
          {showInput ? 'Save Project' : 'Create Project'}
        </Button>
      </Flex>
    </Box>
  );
};

export default ProjectSidebar;
