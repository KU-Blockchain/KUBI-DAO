import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import ProjectManagerArtifact from '../abi/ProjectManager.json'; 
import { useWeb3Context } from './Web3Context';


const leaderboardContext = createContext();

export const useLeaderboard = () => {
  return useContext(leaderboardContext);
};



export const LeaderboardProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [sortField, setSortField] = useState('kubix');
    const [sortOrder, setSortOrder] = useState('desc');
    const PMContract = "0x6a55a93CA73DFC950430aAeDdB902377fE51a8FA";
    const {signerUniversal} = useWeb3Context()
    const[leaderboardLoaded, setLeaderboardLoaded] = useState(false);


  const fetchLeaderboardData = async () => {
    if (signerUniversal) {
      const contractPM = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signerUniversal);
      const accountsDataIpfsHash = await contractPM.accountsDataIpfsHash();
      let accountsDataJson = {};
      if (accountsDataIpfsHash !== '') {
        console.log("test")
        accountsDataJson = await (await fetch(`https://kubidao.infura-ipfs.io/ipfs/${accountsDataIpfsHash}`)).json();
      }

      const leaderboardData = Object.entries(accountsDataJson).map(([address, data]) => ({
        id: address,
        name: data.username || 'Anonymous',
        kubix: data.kubixBalance || 0,
        tasks: data.tasksCompleted || 0,
      }));

      const sortedData = leaderboardData.sort((a, b) => {
        if (a.kubix > b.kubix) return sortOrder === 'asc' ? 1 : -1;
        if (a.kubix < b.kubix) return sortOrder === 'asc' ? -1 : 1;
        return 0;
      });
      setData(sortedData);
    }
  };



  useEffect(() => {
    if (leaderboardLoaded) {
        console.log("fetching leaderboard data")
      fetchLeaderboardData();
    }
  }, [leaderboardLoaded]);


  return (
    <leaderboardContext.Provider value={{ data, setData, setSortField, sortOrder, setSortOrder, setLeaderboardLoaded }}>
      {children}
    </leaderboardContext.Provider>
  );
};
