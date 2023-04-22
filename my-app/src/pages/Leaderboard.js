import React, { useState, useEffect, useCallback } from 'react';
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
import { TriangleDownIcon } from '@chakra-ui/icons';
import ProjectManagerArtifact from '../abi/ProjectManager.json';
import { useWeb3Context } from '../contexts/Web3Context';

const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

const Leaderboard = () => {
  const { KUBIXbalance } = useWeb3Context();
  const [timeframe, setTimeframe] = useState('semester');
  const [sortField, setSortField] = useState('kubix');
  const [sortOrder, setSortOrder] = useState('desc');

  const [data, setData] = useState([]);

  const PMContract = "0x6a55a93CA73DFC950430aAeDdB902377fE51a8FA";

  const fetchLeaderboardData = useCallback(async () => {
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

      // Sort data initially by kubix
      const sortedData = leaderboardData.sort((a, b) => {
        if (a.kubix > b.kubix) return sortOrder === 'asc' ? 1 : -1;
        if (a.kubix < b.kubix) return sortOrder === 'asc' ? -1 : 1;
        return 0;
      });

      setData(sortedData);
    }
  }, [provider, signer, KUBIXbalance]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [provider, signer, KUBIXbalance]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    // Update data based on the selected timeframe
    // setData(fetchData(newTimeframe));
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder('desc');

    const sortedData = [...data].sort((a, b) => {
      if (a[field] > b[field]) return -1;
      if (a[field] < b[field]) return 1;
      return 0
    });

    setData(sortedData);
  };

  const getMedalColor = (rank) => {
    switch (rank) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return '#cd7f32';
      default:
        return null;
    }
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
                <Th>Rank</Th>
                <Th>Name</Th>
                <Th>
                  KUBIX
                  <IconButton
                    size="xs"
                    aria-label="Sort by KUBIX"
                    icon={<TriangleDownIcon />}
                    onClick={() => handleSort('kubix')}
                  />
                </Th>
                <Th>
                  Tasks Completed
                  <IconButton
                    size="xs"
                    aria-label="Sort by Tasks Completed"
                    icon={<TriangleDownIcon />}
                    onClick={() => handleSort('tasks')}
                  />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((entry, index) => {
                const medalColor = getMedalColor(index);
                return (
                  <Tr key={entry.id} fontWeight={medalColor ? 'extrabold' : null}>
                    <Td style={{ color: medalColor }}>{index + 1}</Td>
                    <Td>{entry.name}</Td>
                    <Td style={{ color: medalColor }}>{entry.kubix}</Td>
                    <Td style={{ color: medalColor }}>{entry.tasks}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Leaderboard;

