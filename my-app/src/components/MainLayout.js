import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';
import { TaskBoardProvider } from '../contexts/TaskBoardContext';
import { ethers } from 'ethers';
import ipfs from '../db/ipfs';
import ProjectManagerArtifact from '../abi/ProjectManager.json';

const MainLayout = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadInitialProject = async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
      const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
      const contract = new ethers.Contract("0xb8D2DCb0B048FeE36584896B4d06d780d5973f65", ProjectManagerArtifact.abi, signer);

      const projectCount = await contract.getProjectIdCounter();
      const projectsData = [];

      for (let i = 1; i <= projectCount; i++) {
        const projectData = await contract.projects(i);
        const projectId = projectData.id.toNumber(); // <-- get the project ID from the smart contract
        const projectIpfsHash = projectData.ipfsHash;
        const projectColumns = JSON.parse(await (await fetch(`https://ipfs.io/ipfs/${projectIpfsHash}`)).text());
        
        projectsData.push({
          id: projectId, 
          name: `Project ${projectId}`,
          columns: projectColumns,
        });
      }

      setProjects(projectsData);
      
      // Only select the first project if there is at least one project
      if (projectsData.length > 0 && !selectedProject) {
        handleSelectProject(projectsData[0].id);
      }
    };

    loadInitialProject();
  }, []);

  const handleSelectProject = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
  };

  const handleUpdateColumns = async (newColumns) => {
    // Update state
    setSelectedProject((prevSelectedProject) => ({
      ...prevSelectedProject,
      columns: newColumns,
    }));

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === selectedProject.id ? { ...project, columns: newColumns } : project
      )
    );

    // Save project updates to IPFS and update the smart contract
    const ipfsResult = await ipfs.add(JSON.stringify(newColumns));
    const newIpfsHash = ipfsResult.path;

    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
    const contract = new ethers.Contract("0xb8D2DCb0B048FeE36584896B4d06d780d5973f65", ProjectManagerArtifact.abi, signer);

    await contract.updateProject(selectedProject.id, newIpfsHash);
  };

  const handleCreateProject = async (projectName) => {
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

    // Save the new project to IPFS
    const ipfsResult = await ipfs.add(JSON.stringify(newProject.columns));
    const newIpfsHash = ipfsResult.path;

    // Create the project on the smart contract
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
    const contract = new ethers.Contract("0xb8D2DCb0B048FeE36584896B4d06d780d5973f65", ProjectManagerArtifact.abi, signer);

    await contract.createProject(newIpfsHash);

    setProjects([...projects, newProject]);
    handleSelectProject(newProject.id);
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

