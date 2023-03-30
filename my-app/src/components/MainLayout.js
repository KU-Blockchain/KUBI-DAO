import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';

const MainLayout = () => {
  const initialColumns = [
    {
      id: "open",
      title: "Open",
      tasks: [
        { id: "1", name: "Task 1", description: "This is task 1", kubixPayout: 100 },
        { id: "2", name: "Task 2", description: "This is task 2", kubixPayout: 200 },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      tasks: [
        { id: "3", name: "Task 3", description: "This is task 3", kubixPayout: 150 },
      ],
    },
    {
      id: "inReview",
      title: "In Review",
      tasks: [
        { id: "4", name: "Task 4", description: "This is task 4", kubixPayout: 300 },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      tasks: [
        { id: "5", name: "Task 5", description: "This is task 5", kubixPayout: 250 },
      ],
   
    
}];

const [projects, setProjects] = useState([
{ id: 1, name: 'Project 1', columns: initialColumns },
{ id: 2, name: 'Project 2', columns: initialColumns },
{ id: 3, name: 'Project 3', columns: initialColumns },
]);

const [selectedProject, setSelectedProject] = useState(projects[0]);

const handleSelectProject = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
  };

const handleCreateProject = (projectName) => {
    const newProject = {
      id: projects.length + 1,
      name: projectName,
      columns: [], // Start with an empty array or any initial columns
    };
    setProjects([...projects, newProject]);
  };

  return (
    <Flex w="100%" h="100vh">
      <ProjectSidebar
        projects={projects}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
      />
      <TaskBoard columns={selectedProject.columns} />
    </Flex>
  );
};
  


export default MainLayout;