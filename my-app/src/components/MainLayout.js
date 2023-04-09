import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';
import { TaskBoardProvider } from '../contexts/TaskBoardContext';
import { useDataBaseContext, DataBaseProvider } from '../contexts/DataBaseContext';


const MainLayout = () => {
  const {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    handleUpdateColumns,
    handleCreateProject,
  } = useDataBaseContext();

  

  const handleSelectProject = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
  };




  return (
    <Flex w="100%" h="100vh">
      <ProjectSidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
      />
      {selectedProject ? (
        <TaskBoardProvider
          key={selectedProject.id}
          projectId={selectedProject.id}
          initialColumns={selectedProject.columns}
          onColumnChange={(newColumns) => handleUpdateColumns(newColumns)}
          onUpdateColumns={(newColumns) => handleUpdateColumns(newColumns)}
        >
          <TaskBoard />
        </TaskBoardProvider>
      ) : (
        <Flex flexGrow={1} justifyContent="center" alignItems="center">
          <div>No projects selected, please create or select a project.</div>
        </Flex>
      )}
    </Flex>
  );
};

export default MainLayout;

