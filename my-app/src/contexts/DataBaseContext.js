import { providers, JsonRpcBatchProvider, ethers } from 'ethers';
import ipfs from '../db/ipfs';
import ProjectManagerArtifact from '../abi/ProjectManager.json';
import { createContext, useContext, useState, useEffect } from 'react';


const DataBaseContext = createContext();

export const useDataBaseContext = () => {
  return useContext(DataBaseContext);
};

export const DataBaseProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [account, setAccount] = useState('');
  const [updateInProgress, setUpdateInProgress] = useState(false);

  const PMContract = '0x9C5ba7F2Fa8a951E982B4d9C87A0447522CfBFC2';

  // Create provider, signer, and contract instances only once
  const provider = new providers.JsonRpcProvider(
    'https://rpc-mumbai.maticvigil.com/'
  );
  const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signer);

  useEffect(() => {
    const loadInitialProject = async () => {
      const projectCount = await contract.getProjectIdCounter();
      const projectIds = Array.from({ length: projectCount }, (_, i) => i + 1);

      // Use batch requests to fetch project data
      
      const batchRequests = projectIds.map((id) => contract.projects(id));

      const projectResults = await Promise.all(batchRequests);

      

      const projectsData = await Promise.all(
        projectResults.map(async (projectData, i) => {
          const projectId = i + 1;
          const projectIpfsHash = projectData.ipfsHash;
          const projectDataFromIPFS = JSON.parse(
            await (await fetch(`https://ipfs.io/ipfs/${projectIpfsHash}`)).text()
          );
          const projectName = projectDataFromIPFS.name;
          const projectColumns = projectDataFromIPFS.columns;

          return {
            id: projectId,
            name: projectName,
            columns: projectColumns,
          };
        })
      );

      setProjects(projectsData);
      setSelectedProject(projectsData[0]);
    };

    loadInitialProject();
  }, []);

  //handle updating the project data in the smart contract and ipfs when collumn changes
  const handleUpdateColumns = async (newColumns) => {
    if (updateInProgress) {
      return;
    }
    setUpdateInProgress(true);
    // Fetch the latest version of the project data from IPFS and the smart contract
    const provider = new providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signer);
    const projectData = await contract.projects(selectedProject.id);
    const projectIpfsHash = projectData.ipfsHash;
    const latestProjectData = JSON.parse(await (await fetch(`https://ipfs.io/ipfs/${projectIpfsHash}`)).text());
        console.log("checked for changes")
        // Merge the latest version of the project data with the new columns
        console.log('Latest project data:', latestProjectData.columns);
        const mergedColumns = latestProjectData.columns.map((column) => {
          console.log('handleUpdateColumns called:', newColumns);
          const newColumn = newColumns.find((c) => c.id === column.id);
          return newColumn ? { ...column, tasks: newColumn.tasks } : column;
        });
        console.log('Merged columns:', mergedColumns);
    
        // Update state with the merged data
        setSelectedProject((prevSelectedProject) => ({
        ...prevSelectedProject,
        columns: mergedColumns,
        }));
        setProjects((prevProjects) =>
        prevProjects.map((project) =>
            project.id === selectedProject.id ? { ...project, columns: mergedColumns } : project
        )
        );
    
        // Save the updated project data to IPFS and the smart contract
        const projectDataToUpdate = {
        name: selectedProject.name,
        columns: mergedColumns,
        };
        const ipfsResult = await ipfs.add(JSON.stringify(projectDataToUpdate));
        const newIpfsHash = ipfsResult.path;
        await contract.updateProject(selectedProject.id, newIpfsHash);
        console.log("updated project on smart contract")

        setUpdateInProgress(false);
    };
    
    //handle creating a new project and uploading to ipfs and smart contract
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

        const projectData = {
        name: newProject.name, 
        columns: newProject.columns,
        };
        // Save the new project to IPFS
        const ipfsResult = await ipfs.add(JSON.stringify(projectData));
        const newIpfsHash = ipfsResult.path;

        // Create the project on the smart contract
        const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
        const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signer);

        await contract.createProject(newIpfsHash);

        setProjects([...projects, newProject]);
    };

    //fetch user details from ipfs and smart contract
    const fetchUserDetails = async () => {
        if (!web3 || !account) return;
        try {

      
          // Fetch the accounts data IPFS hash from the smart contract
          const accountsDataIpfsHash = await contract.accountsDataIpfsHash();
      
          // If the IPFS hash is not empty, fetch the JSON data
          if (accountsDataIpfsHash !== '') {
            const accountsDataJson = await (await fetch(`https://ipfs.io/ipfs/${accountsDataIpfsHash}`)).json();
            if (accountsDataJson[account]) {
              setUserDetails(accountsDataJson[account]);
            }
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      const addUserData = async (name, username,email) => {
        

        
          // Fetch the accounts data IPFS hash from the smart contract
          const accountsDataIpfsHash = await contract.accountsDataIpfsHash();
          let accountsDataJson = {};
        
          // If the IPFS hash is not empty, fetch the JSON data
          if (accountsDataIpfsHash !== '') {
            accountsDataJson = await (await fetch(`https://ipfs.io/ipfs/${accountsDataIpfsHash}`)).json();
          }
        
          // Add the new user data to the existing accounts data
          accountsDataJson[account] = {
            name,
            username,
            email,
          };
        
          // Save the updated accounts data to IPFS
          const ipfsResult = await ipfs.add(JSON.stringify(accountsDataJson));
          const newIpfsHash = ipfsResult.path;
        
          // Update the accounts data IPFS hash in the smart contract
          await contract.updateAccountsData(newIpfsHash);
        

        
      };
      const getUsernameByAddress = async (walletAddress) => {
        try {

      
          // Fetch the accounts data IPFS hash from the smart contract
          const accountsDataIpfsHash = await contract.accountsDataIpfsHash();
          let accountsDataJson = {};
      
          // If the IPFS hash is not empty, fetch the JSON data
          if (accountsDataIpfsHash !== '') {
            accountsDataJson = await (await fetch(`https://ipfs.io/ipfs/${accountsDataIpfsHash}`)).json();
          }
      
          // Check if the wallet address exists in the accounts data JSON and return the associated username
          if (accountsDataJson[walletAddress]) {
            return accountsDataJson[walletAddress].username;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error fetching username by address:", error);
          return null;
        }
      };
      
    
    return (
        <DataBaseContext.Provider
        value={{
            projects,
            setProjects,
            selectedProject,
            setSelectedProject,
            handleUpdateColumns,
            handleCreateProject,
            userDetails,
            setUserDetails,
            account,
            setAccount,
            fetchUserDetails,
            addUserData,
            getUsernameByAddress,
        }}
        >
        {children}
        </DataBaseContext.Provider>

      );
    };