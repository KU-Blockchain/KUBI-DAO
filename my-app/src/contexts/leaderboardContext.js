import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import ProjectManagerArtifact from '../abi/ProjectManager.json'; 
import { useWeb3Context } from './Web3Context';
import ipfs from '../db/ipfs';


const leaderboardContext = createContext();

export const useLeaderboard = () => {
  return useContext(leaderboardContext);
};



export const LeaderboardProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [semesterData, setSemesterData] = useState([]);

    const [sortField, setSortField] = useState('kubix');
    const [sortOrder, setSortOrder] = useState('desc');
    const PMContract = "0x6a55a93CA73DFC950430aAeDdB902377fE51a8FA";
    const {signerUniversal} = useWeb3Context()
    const[leaderboardLoaded, setLeaderboardLoaded] = useState(false);


    async function fetchFromIpfs(ipfsHash) {
      let stringData = '';
      for await (const chunk of ipfs.cat(ipfsHash)) {
          stringData += new TextDecoder().decode(chunk);
      }
      try {
          return JSON.parse(stringData);
      } catch (error) {
          console.error("Error parsing JSON from IPFS:", error, "stringData:", stringData);
          throw error;
      }
  }

    const fetchLeaderboardData = async () => {
        if (signerUniversal) {
            const contractPM = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signerUniversal);
            const accountsDataIpfsHash = await contractPM.accountsDataIpfsHash();
            let accountsDataJson = {};
            if (accountsDataIpfsHash !== '') {
                console.log("test");
                accountsDataJson = await fetchFromIpfs(accountsDataIpfsHash);
            }
    
            // Calculate the current yearSemester
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            let semester = '';
            let month = currentDate.getMonth();
            let date = currentDate.getDate();
            
            if (month < 5) {
                semester = 'Spring';
            } else if (month < 7 || (month === 7 && date < 16)) { // Before August 16th
                semester = 'Summer';
            } else {
                semester = 'Fall';
            }
            
            console.log(semester);
            
    
            const yearSemester = `${currentYear}${semester}`;
            const kubixKey = `kubixBalance${yearSemester}`;
            const tasksKey = `tasksCompleted${yearSemester}`;
    
            // Process each entry in accountsDataJson
            const leaderboardData = Object.entries(accountsDataJson).map(([address, data]) => ({
                id: address,
                name: data.username || 'Anonymous',
                kubix: data.kubixBalance || 0, // Default to total kubixBalance
                tasks: data.tasksCompleted || 0, // Default to total tasksCompleted
            }));
    
            const semesterLeaderboardData = Object.entries(accountsDataJson)
            .filter(([_, data]) => data[kubixKey] && data[kubixKey] > 0) // filter out entries with kubixKey 0 or undefined
            .map(([address, data]) => ({
              id: address,
              name: data.username || 'Anonymous',
              kubix: data[kubixKey], 
              tasks: data[tasksKey] || 0, 
            }));
          
    
            // Sorting
            const sortedData = leaderboardData.sort((a, b) => (a.kubix > b.kubix ? (sortOrder === 'asc' ? 1 : -1) : a.kubix < b.kubix ? (sortOrder === 'asc' ? -1 : 1) : 0));
            const sortedSemesterData = semesterLeaderboardData.sort((a, b) => (a.kubix > b.kubix ? (sortOrder === 'asc' ? 1 : -1) : a.kubix < b.kubix ? (sortOrder === 'asc' ? -1 : 1) : 0));
    
            setData(sortedData);
            setSemesterData(sortedSemesterData); 
        }
    };
  



  useEffect(() => {
    if (leaderboardLoaded) {
        console.log("fetching leaderboard data")
      fetchLeaderboardData();
    }
  }, [leaderboardLoaded]);


  return (
    <leaderboardContext.Provider value={{semesterData, data, setData, setSortField, sortOrder, setSortOrder, setLeaderboardLoaded }}>
      {children}
    </leaderboardContext.Provider>
  );
};
