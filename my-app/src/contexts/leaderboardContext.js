import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ProjectManagerArtifact from '../abi/ProjectManager.json'; 

const provider = new ethers.providers.JsonRpcProvider(process.env. NEXT_PUBLIC_INFURA_URL);
const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

const leaderboardContext = createContext();

export const useLeaderboard = () => {
  return useContext(leaderboardContext);
};

export const LeaderboardProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState('kubix');
  const [sortOrder, setSortOrder] = useState('desc');
  const PMContract = "0x6a55a93CA73DFC950430aAeDdB902377fE51a8FA";

  const fetchLeaderboardData = async () => {
    if (provider && signer) {
      const contractPM = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signer);
      const accountsDataIpfsHash = await contractPM.accountsDataIpfsHash();
      let accountsDataJson = {};
      if (accountsDataIpfsHash !== '') {
        accountsDataJson = await (await fetch(`https://kubidao.infura-ipfs.io/ipfs/${accountsDataIpfsHash}`)).json();
      }

      const leaderboardData = Object.entries(accountsDataJson).map(([address, data]) => ({
        id: address,
        name: data.username || 'Anonymous',
        kubix: data.kubixBalance || 0,
        tasks: data.tasksCompleted || 0,
      }));

      setData(leaderboardData);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return (
    <leaderboardContext.Provider value={{ data, setSortField, sortOrder, setSortOrder }}>
      {children}
    </leaderboardContext.Provider>
  );
};
