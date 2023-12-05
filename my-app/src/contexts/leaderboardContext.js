import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ProjectManagerArtifact from '../abi/ProjectManager.json'; 
import { useWeb3Context } from './Web3Context';
import ipfs from '../db/ipfs';
import { useIPFScontext } from './IPFScontext';

const leaderboardContext = createContext();

export const useLeaderboard = () => {
  return useContext(leaderboardContext);
};

export const LeaderboardProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [semesterData, setSemesterData] = useState([]);
    const [yearLeaderboardData, setYearLeaderboardData] = useState([]); // New state for year leaderboard

    const [sortField, setSortField] = useState('kubix');
    const [sortOrder, setSortOrder] = useState('desc');
    const PMContract = "0x6a55a93CA73DFC950430aAeDdB902377fE51a8FA";
    const { signerUniversal } = useWeb3Context()
    const { fetchFromIpfs } = useIPFScontext();
    const [leaderboardLoaded, setLeaderboardLoaded] = useState(false);

    const fetchLeaderboardData = async () => {
        if (signerUniversal) {
            const contractPM = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signerUniversal);
            const accountsDataIpfsHash = await contractPM.accountsDataIpfsHash();
            console.log('accountsDataIpfsHash', accountsDataIpfsHash);
            let accountsDataJson = {};
            if (accountsDataIpfsHash !== '') {
                accountsDataJson = await fetchFromIpfs(accountsDataIpfsHash);
            }

            console.log('accountsDataJson', accountsDataJson);

            // Calculate the current yearSemester
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            let semester = '';
            let month = currentDate.getMonth();
            let date = currentDate.getDate();
            
            if (month < 5) {
                semester = 'Spring';
            } else if (month < 7 || (month === 7 && date < 16)) {
                semester = 'Summer';
            } else {
                semester = 'Fall';
            }
            
            const yearSemester = `${currentYear}${semester}`;
            const lastYearSemester = `${semester === 'Spring' ? currentYear - 1 : currentYear}${semester === 'Spring' ? 'Fall' : semester === 'Summer' ? 'Spring' : 'Summer'}`; // Determine last semester
            console.log('yearSemester', yearSemester);
            console.log('lastYearSemester', lastYearSemester);
            
            const kubixKey = `kubixBalance${yearSemester}`;
            const tasksKey = `tasksCompleted${yearSemester}`;
            const lastYearKubixKey = `kubixBalance${lastYearSemester}`;
            const lastYearTasksKey = `tasksCompleted${lastYearSemester}`;

            const semesters = ['Fall', 'Spring', 'Summer'];
            let activeSemesters = semesters.slice(semesters.indexOf(semester));
            if (semester !== 'Fall') {
                activeSemesters.unshift('Fall'); // Add previous fall if it's not currently fall
            }

            // Compute keys for the active semesters
            let semesterKeys = [];
            if (semester === 'Fall') {
                semesterKeys = [`${currentYear}Fall`];
            } else if (semester === 'Spring') {
                semesterKeys = [`${currentYear - 1}Fall`, `${currentYear}Spring`];
            } else { // Summer
                semesterKeys = [`${currentYear - 1}Fall`, `${currentYear}Spring`, `${currentYear}Summer`];
            }

            console.log('semesterKeys', semesterKeys);

            // Process each entry in accountsDataJson
            const leaderboardData = Object.entries(accountsDataJson).map(([address, data]) => ({
                id: address,
                name: data.username || 'Anonymous',
                kubix: data.kubixBalance || 0,
                tasks: data.tasksCompleted || 0,
            }));

            const semesterLeaderboardData = Object.entries(accountsDataJson)
              .filter(([_, data]) => data[kubixKey] && data[kubixKey] > 0)
              .map(([address, data]) => ({
                  id: address,
                  name: data.username || 'Anonymous',
                  kubix: data[kubixKey],
                  tasks: data[tasksKey] || 0,
              }));

              const yearLeaderboard = Object.entries(accountsDataJson)
              .map(([address, data]) => {
                  let kubix = 0, tasks = 0;
                  semesterKeys.forEach(key => {
                      kubix += data[`kubixBalance${key}`] || 0;
                      tasks += data[`tasksCompleted${key}`] || 0;
                  });
                  return { id: address, name: data.username || 'Anonymous', kubix, tasks };
              })
              .filter(entry => entry.kubix > 0);

            // Sorting
            const sortedData = leaderboardData.sort((a, b) => (a[sortField] > b[sortField] ? (sortOrder === 'asc' ? 1 : -1) : a[sortField] < b[sortField] ? (sortOrder === 'asc' ? -1 : 1) : 0));
            const sortedSemesterData = semesterLeaderboardData.sort((a, b) => (a[sortField] > b[sortField] ? (sortOrder === 'asc' ? 1 : -1) : a[sortField] < b[sortField] ? (sortOrder === 'asc' ? -1 : 1) : 0));
            const sortedYearLeaderboard = yearLeaderboard.sort((a, b) => (a[sortField] > b[sortField] ? (sortOrder === 'asc' ? 1 : -1) : a[sortField] < b[sortField] ? (sortOrder === 'asc' ? -1 : 1) : 0));

            setData(sortedData);
            setSemesterData(sortedSemesterData);
            setYearLeaderboardData(sortedYearLeaderboard); // Set year leaderboard data
            console.log('sortedData', sortedData);
            console.log('sortedSemesterData', sortedSemesterData);
            console.log('sortedYearLeaderboard', sortedYearLeaderboard);
        }
    };

    useEffect(() => {
        if (leaderboardLoaded) {
            fetchLeaderboardData();
        }
    }, [leaderboardLoaded]);

    return (
        <leaderboardContext.Provider value={{ semesterData, data, setData, setSortField, sortOrder, setSortOrder, setLeaderboardLoaded, yearLeaderboardData }}>
            {children}
        </leaderboardContext.Provider>
    );
};
