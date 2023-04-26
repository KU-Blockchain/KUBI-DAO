import React, { useState, useEffect } from 'react';
import { Flex, Box, Heading, Button,} from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';
import { TaskBoardProvider } from '../../contexts/TaskBoardContext';
import { useDataBaseContext, DataBaseProvider } from '../../contexts/DataBaseContext';
import { useWeb3Context, Web3Provider } from '../../contexts/Web3Context';
import { Alert } from '@chakra-ui/alert';
import ProjectDescription from './ProjectDescription';


const MainLayout = () => {
  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    handleUpdateColumns,
    handleCreateProject,
  } = useDataBaseContext();

  const {account}= useWeb3Context()
  const [projectName,setProjectName]=useState('No Project Selected');

  const [activeTab,setActiveTab]=useState(true)
  
  React.useEffect(() => {
    console.log("Mounted")
    setTimeout(()=>{
      try {
        
        setProjectName(selectedProject.name)
      } catch (error) {
        
      }
    },2000)
    return ()=>{console.log("UnMounted")}
  }, []);
  
  
  

  const handleSelectProject = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
    setProjectName(selected.name);
  };




  return (
    <Flex direction="column" w="100%" minH="85vh">
      <Box bg={"cornflowerblue"} p={4} boxShadow="md">
        <Heading mr={"300px"}color={'white'} size="md">{projectName}</Heading>
        <Button 
        textColor={(activeTab ? 'white' : 'black')}
        _hover={{bg:"red.400"}}
        bg={activeTab ? 'red' : 'ghostwhite'}
        onClick={()=>setActiveTab(true)}>Task Board</Button>
        <Button
        textColor={(!activeTab ? 'white' : 'black')}
        _hover={{bg:"red.400"}}
        bg={(!activeTab) ? 'red' : 'ghostwhite'}
        onClick={()=>setActiveTab(false)}>Project Description</Button>
      </Box>
      
       <Flex w="100%" flex="1">
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
        />
        {activeTab ? (
          selectedProject ? (
            <TaskBoardProvider 
              key={selectedProject.id}
              projectId={selectedProject.id}
              initialColumns={selectedProject.columns}
              onColumnChange={(newColumns) => handleUpdateColumns(newColumns)}
              onUpdateColumns={(newColumns) => handleUpdateColumns(newColumns)}
              account={account}
            >
              <TaskBoard />
            </TaskBoardProvider>
          ) : (
            <Flex flexGrow={1} justifyContent="center" alignItems="center">
              <div>No projects selected, please create or select a project.</div>
            </Flex>
          )
        ) : (
          <ProjectDescription />
        )}
         
      </Flex>
    </Flex>
    
  ); 
};

export default MainLayout;

