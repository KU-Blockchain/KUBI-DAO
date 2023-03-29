// src/components/MainLayout.js
import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';

const MainLayout = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Project 1', columns: [] },
    { id: 2, name: 'Project 2', columns: [] },
    { id: 3, name: 'Project 3', columns: [] },
  ]);

  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const handleSelectProject = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
  };

  return (
    <Flex>
      <ProjectSidebar projects={projects} onSelectProject={handleSelectProject} />
      <TaskBoard columns={selectedProject.columns} />
    </Flex>
  );
};

export default MainLayout;
