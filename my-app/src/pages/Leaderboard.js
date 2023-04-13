import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import ProjectManagerArtifact from '../abi/ProjectManager.json';

const sampleData = [
  { id: 1, name: 'John Doe', kubix: 500, tasks: 5, polls: 15, projectContribution: 300 },
  { id: 2, name: 'Jane Smith', kubix: 400, tasks: 15, polls: 12, projectContribution: 200 },
  { id: 3, name: 'Alice Brown', kubix: 300, tasks: 10, polls: 8, projectContribution: 150 },
];

const Leaderboard = () => {

  const [timeframe, setTimeframe] = useState('semester');
  const [sortField, setSortField] = useState('kubix');
  const [sortOrder, setSortOrder] = useState('desc');
  const { provider, signer, mintKUBIX } = useWeb3Context();
  const [data, setData] = useState([]);

  const PMContract= "0x9C5ba7F2Fa8a951E982B4d9C87A0447522CfBFC2"

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (provider && signer) {
        const contractPM = new ethers.Contract(PMContract, ProjectManagerArtifact.abi, signer);

        // Fetch the accountsData IPFS hash from the smart contract
        const accountsDataIpfsHash = await contractPM.accountsDataIpfsHash();
        let accountsDataJson = {};

        // If the IPFS hash is not empty, fetch the JSON data
        if (accountsDataIpfsHash !== '') {
          accountsDataJson = await (await fetch(`https://ipfs.io/ipfs/${accountsDataIpfsHash}`)).json();
        }

        // Format data for the leaderboard
        const leaderboardData = Object.entries(accountsDataJson).map(([address, data]) => ({
          id: address,
          name: data.username || 'Anonymous',
          kubix: data.kubixBalance || 0,
          tasks: data.tasksCompleted || 0,
        }));

        setData(leaderboardData);
      }
    };

    fetchLeaderboardData();
  }, [provider, signer]);


  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    // Update data based on the selected timeframe
    // setData(fetchData(newTimeframe));
  };

  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);

    const sortedData = [...data].sort((a, b) => {
      if (a[field] > b[field]) return newSortOrder === 'asc' ? 1 : -1;
      if (a[field] < b[field]) return newSortOrder === 'asc' ? -1 : 1;
      return 0;
    });

    setData(sortedData);
  };

  return (
    <Box w="100%" minH="100vh" p={4}>
      <VStack spacing={4}>
        <Heading as="h1">Leaderboard</Heading>
        <HStack spacing={4}>
          <Button onClick={() => handleTimeframeChange('semester')} isActive={timeframe === 'semester'}>Semester</Button>
          <Button onClick={() => handleTimeframeChange('year')} isActive={timeframe === 'year'}>Year</Button>
          <Button onClick={() => handleTimeframeChange('allTime')} isActive={timeframe === 'allTime'}>All Time</Button>
        </HStack>
        <Flex justifyContent="center" alignItems="center">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>
                  KUBIX
                  <IconButton
                    size="xs"
                    aria-label="Sort by KUBIX"
                    icon={sortField === 'kubix' && sortOrder === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />}
                    onClick={() => handleSort('kubix')}
                  />
                </Th>
                <Th>
                  Tasks Completed
                  <IconButton
                    size="xs"
                    aria-label="Sort by Tasks Completed"
                    icon={sortField === 'tasks' && sortOrder === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />}
                    onClick={() => handleSort('tasks')}
                  />
                </Th>
                <Th>
                  Polls Voted In
                  <IconButton
                    size="xs"
                    aria-label="Sort by Polls Voted In"
                    icon={sortField === 'polls' && sortOrder === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />}
                    onClick={() => handleSort('polls')}
                  />
                </Th>
                <Th>
                  Project Contribution
                  <IconButton
                    size="xs"
                    aria-label="Sort by Project Contribution"
                    icon={sortField === 'projectContribution' && sortOrder === 'asc' ? <TriangleUpIcon /> : <TriangleDownIcon />}
                    onClick={() => handleSort('projectContribution')}
                    />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((entry) => (
                  <Tr key={entry.id}>
                    <Td>{entry.name}</Td>
                    <Td>{entry.kubix}</Td>
                    <Td>{entry.tasks}</Td>
                    <Td>{entry.polls}</Td>
                    <Td>{entry.projectContribution}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Flex>
        </VStack>
      </Box>
    );
  };
  
  export default Leaderboard;
  
