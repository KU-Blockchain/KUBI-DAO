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
import { useWeb3Context } from '../../contexts/Web3Context';
import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableProject from './DraggableProject';
import TrashBin from './TrashBin';


const ProjectSidebar = ({ projects,selectedProject, onSelectProject, onCreateProject }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { hasExecNFT} = useWeb3Context();
  const { handleDeleteProject } = useDataBaseContext();
  
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
  const onDeleteProject = (projectId) => {
    if(hasExecNFT){
      handleDeleteProject(projectId);
    }
    else{
      alert('You must be an executive to delete project');
    }

  }

  return (
    <DndProvider backend={HTML5Backend}>
    <Box
      bg="gray.200"
      w="300px"
      h="85vh"
      p={2}
      marginRight={2}
      borderRight="1px"
      borderColor="gray.300"
      display="flex"
      flexDirection="column"
    >
      <Heading size="md" mb={4}>
        Projects
        </Heading>
      <Box flexGrow={1} overflowY="auto" pl={1} pr={1}>
      
        <VStack spacing={4} align="start">
          {projects.map((project) => {
            const isSelected = selectedProject && project.id === selectedProject.id;

            return (
              <DraggableProject
                key={project.id}
                project={project}
                isSelected={isSelected}
                onSelectProject={onSelectProject}
                onDeleteProject={onDeleteProject}
              />
            );
          })}
        </VStack>

      </Box>
      
      <Spacer />
      <TrashBin onDeleteProject={onDeleteProject} />
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
    </DndProvider>
  );
};

export default ProjectSidebar;
