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

import '../styles/TaskColumn.module.css';

const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

const glassLayerStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  zIndex: -1,
  borderRadius: 'inherit',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, .8)',
};

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
    <Box position="relative" w="100%" minH="100vh" p={4} bg="cornflowerblue">
      <VStack spacing={4}>
        <Heading as="h1">Leaderboard</Heading>
        <HStack spacing={4}>
          <Button onClick={() => handleTimeframeChange('semester')} isActive={timeframe === 'semester'}>Semester</Button>
          <Button onClick={() => handleTimeframeChange('year')} isActive={timeframe === 'year'}>Year</Button>
          <Button onClick={() => handleTimeframeChange('allTime')} isActive={timeframe === 'allTime'}>All Time</Button>
        </HStack>
        <Flex justifyContent="center" alignItems="center">
          <Box
            w="100%"
            mt="4%"
            borderRadius="2xl"
            bg="transparent"
            boxShadow="lg"
            position="relative"
            zIndex={1}
          >
            <div style={glassLayerStyle} />
            <Table variant="simple" className="leaderboard-table">
              <Thead>
                <Tr>
                  <Th color="ghostwhite">Rank</Th>
                  <Th color="ghostwhite">Name</Th>
                  <Th color="ghostwhite">
                    KUBIX
                    <IconButton
                      size="xs"
                      aria-label="Sort by KUBIX"
                      icon={<TriangleDownIcon color="gray.600" />}
                      onClick={() => handleSort('kubix')}
                    />
                  </Th>
                  <Th color="ghostwhite">
                    Tasks Completed
                    <IconButton
                      size="xs"
                      aria-label="Sort by Tasks Completed"
                      icon={<TriangleDownIcon color="gray.600" />}
                      onClick={() => handleSort('tasks')}
                    />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((entry, index) => {
                  const medalColor = getMedalColor(index);
                  return (
                    <Tr
                      key={entry.id}
                      fontWeight={medalColor ? 'extrabold' : null}
                      _last={{ borderBottom: 'none' }}
                    >
                      <Td borderBottom="none" style={{ color: medalColor || 'ghostwhite' }}>{index + 1}</Td>
                      <Td borderBottom="none" color="ghostwhite">{entry.name}</Td>
                      <Td borderBottom="none" style={{ color: medalColor || 'ghostwhite' }}>{entry.kubix}</Td>
                      <Td borderBottom="none" style={{ color: medalColor || 'ghostwhite' }}>{entry.tasks}</Td>

                    </Tr>


                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
};

export default Leaderboard;

