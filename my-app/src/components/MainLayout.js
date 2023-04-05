import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';
import { TaskBoardProvider } from '../contexts/TaskBoardContext';

const MainLayout = () => {
  const initialColumns = [
    {
      id: "open",
      title: "Open",
      tasks: [
        { id: "1", name: "Task 1", description: "This is task 1",  difficulty: "easy", estHours: 1  },
        { id: "2", name: "Task 2", description: "This is task 2", difficulty: "easy", estHours: 1 },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      tasks: [
        { id: "3", name: "Task 3", description: "This is task 3",  difficulty: "easy", estHours: 1  },
      ],
    },
    {
      id: "inReview",
      title: "In Review",
      tasks: [
        { id: "4", name: "Task 4", description: "This is task 4", difficulty: "easy", estHours: 1  },
      ],
    },
    {
      id: "completed",
      title: "Completed",
      tasks: [
        { id: "5", name: "Task 5", description: "This is task 5", difficulty: "easy", estHours: 1 },
      ],
   
    
}];
const [projects, setProjects] = useState([
  { id: 1, name: 'Project 1', columns: JSON.parse(JSON.stringify(initialColumns)) },
  { id: 2, name: 'Project 2', columns: JSON.parse(JSON.stringify(initialColumns)) },
  { id: 3, name: 'Project 3', columns: JSON.parse(JSON.stringify(initialColumns)) },
]);





const [selectedProject, setSelectedProject] = useState(projects[0]);

useEffect(() => {
  handleSelectProject(projects[0].id);
}, []);


const handleUpdateColumns = (newColumns) => {
  setSelectedProject((prevSelectedProject) => ({
    ...prevSelectedProject,
    columns: newColumns,
  }));

  setProjects((prevProjects) =>
    prevProjects.map((project) =>
      project.id === selectedProject.id ? { ...project, columns: newColumns } : project
    )
  );
};




const handleSelectProject = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
  };

  const handleCreateProject = (projectName) => {
    const newProject = {
      id: projects.length + 1,
      name: projectName,
      columns: [
        { id: "open", title: "Open", tasks: [] },
        { id: "inProgress", title: "In Progress", tasks: [] },
        { id: "inReview", title: "In Review", tasks: [] },
        { id: "completed", title: "Completed", tasks: [] },
      ],
    };
    setProjects([...projects, newProject]);
  };
  

  return (
    <Flex w="100%" h="100vh">
      <ProjectSidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
      />
      <TaskBoardProvider
        key={selectedProject.id} 
        projectId={selectedProject.id}
        initialColumns={selectedProject.columns}
        onColumnChange={(newColumns) => handleUpdateColumns(newColumns)}
      >
        <TaskBoard />
      </TaskBoardProvider>
    </Flex>
  );
  
};
  


export default MainLayout;