import React, { useEffect, useState} from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useLeaderboard } from '../contexts/leaderboardContext';

import '../styles/TaskColumn.module.css';
import { set } from 'lodash';



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

  const {semesterData, data, setLeaderboardLoaded} = useLeaderboard();

  const [leaderboardData, setLeaderboardData] = useState(data);

  const [timeframe, setTimeframe] = useState('year');
  

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    if (newTimeframe === 'semester') {
      setLeaderboardData(semesterData);
    }
    else {
      setLeaderboardData(data);
    }
  };

  useEffect(() => {
    setLeaderboardLoaded(true);

  }, []);

  useEffect(() => {
    setLeaderboardData(data);
  }, [data]);



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
    <Box position="relative" w="100%" minH="100vh" p={4} bg="#2d86fff7">
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

                  </Th>
                  <Th color="ghostwhite">
                    Tasks Completed
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {leaderboardData.map((entry, index) => {
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

