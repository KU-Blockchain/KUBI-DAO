import React, { useState, useEffect } from 'react';
import {HStack, Text, Box, useDisclosure, Flex, Grid, Container, Spacer, VStack, Heading, Tabs, TabList, Tab, TabPanels, TabPanel, Button, Collapse, FormControl, FormLabel, Input, Textarea, RadioGroup, Stack, Radio, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';

import { ethers } from 'ethers';

import { useVoting } from '@/contexts/votingContext';

import { BarChart, Bar, XAxis, YAxis} from 'recharts';
import CountDown from '@/components/voting/countDown';



const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .7)",
};



const Voting = () => {


  const {setVotingLoaded, hashLoaded, fetchPollsIPFS,fetchDataIPFS, setContract,contractX, contractD, contract, loadingVote, setLoadingVote, selectedPoll, setSelectedPoll,selectedOption, setSelectedOption, ongoingPollsKubix, setOngoingPollsKubix, completedPollsKubix, setCompletedPollsKubix, ongoingPollsKubid, setOngoingPollsKubid, completedPollsKubid, setCompletedPollsKubid, completedEnd, setCompletedEnd, totalCompletedCount, setTotalCompletedCount, proposal, setProposal, showCreateVote, setShowCreateVote, blockTimestamp, setBlockTimestamp, loadingSubmit, setLoadingSubmit, handleVote, createPoll, fetchPolls, fetchPollsData, loadMoreCompleted, handleSubmit, showCreatePoll, setShowCreatePoll } = useVoting();


  const [selectedTab, setSelectedTab] = useState(0);



  const { isOpen, onOpen, onClose } = useDisclosure();


  const handlePollClick = (poll) => {
    console.log(poll);
    setSelectedPoll(poll);
    onOpen();
  };




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };



  const handleTabsChange = (index) => {
    setSelectedTab(index);
    if (index == 0) {
      setContract(contractD);
    } else {
      setContract(contractX);
    }
  };

  useEffect(() => {

    setVotingLoaded(true);

  }, []);

  
  useEffect(() => {
    async function loadPolls() {
    if (hashLoaded) {
    await fetchPollsIPFS(contractX, setOngoingPollsKubix, setCompletedPollsKubix);
    await fetchPollsIPFS(contractD, setOngoingPollsKubid, setCompletedPollsKubid);
    }
  }
  loadPolls() 
  }, [hashLoaded]);
  

  
  const handleOptionsChange = (e) => {
    // Split the input string by comma to get an array of options
    const options = e.target.value.split(', ');
    setProposal({ ...proposal, options });
  };
  



  const handleCreatePollClick = () => {
    setShowCreatePoll(!showCreatePoll);
  };


  

  return (
    <>
    <Container maxW="container.2xl" py={6} px={10} >
      
      <Flex align="center" mb={6}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="3xl"
                boxShadow="lg"
                p="2%"
                w="100%"
                
                bg="transparent"
                position="relative"
                display="flex"
                zIndex={0}
                >
      <div className="glass" style={glassLayerStyle} />
        <Heading color= "ghostwhite"size="xl">{selectedTab === 0 ? 'Democracy Voting (KUBI)' : 'Polling (KUBIX)'}</Heading>
        <Spacer />
        <Button fontWeight="black" p="2%" w="20%"bg="green.300" mt="2%" onClick={handleCreatePollClick} _hover={{ bg: "green.400",  transform: "scale(1.05)"} }>
          {selectedTab === 0 ? (showCreateVote ? 'Hide Create Vote Form' : 'Create Vote') : (showCreatePoll ? 'Hide Create Poll Form' : 'Create Poll')}
        </Button>
      </Flex>
  
      <Tabs isFitted variant="soft-rounded" onChange={handleTabsChange} mb={6}>
        
        <TabList          
          alignItems="center"
          justifyContent="center"
          borderRadius="3xl"
          boxShadow="lg"
          p={6}
          w="100%"
          bg="transparent"
          position="relative"
          display="flex"
          zIndex={0}
          color= "ghostwhite"
          
        >
          <div className="glass" style={glassLayerStyle} />
          <Tab 
            fontSize="2xl" 
            fontWeight="extrabold" 
            color= "ghostwhite"
            _selected={{ backgroundColor: "ghostwhite", color: "black" }}
          >
            Votes
          </Tab>
          <Tab 
            fontSize="2xl" 
            fontWeight="extrabold" 
            color= "ghostwhite"
            _selected={{ backgroundColor: "ghostwhite", color: "black" }}
          >
            Polls
          </Tab>

        </TabList>
        <TabPanels>
          
          <TabPanel >
          
          <Flex align="center" mb={8}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="3xl"
                boxShadow="lg"
                p="2%"
                w="100%"
                
                bg="transparent"
                position="relative"
                display="flex"
                zIndex={0}
                >
                  <div className="glass" style={glassLayerStyle} />
       
              <Flex w="100%"  flexDirection="column">

              <VStack  alignItems={"flex-start"} spacing={8} >
              
              {/* Ongoing Votes */}

              <Heading pl= {2} color="ghostwhite" >Ongoing Polls </Heading>
              <HStack justifyContent={"flex-start"} w="100%" spacing={4}>
              {ongoingPollsKubid.length > 0 ? (
                ongoingPollsKubid.map((poll, index) => (
                  <Box key={index} flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="3xl"
                  boxShadow="lg"
                  display="flex"
                  w="30%"
                  minW="30%"
                  maxWidth="30%"
                  bg="transparent"
                  position="relative"
                  color= "ghostwhite"
                  p={2}
                  zIndex={1} 
                    _hover={{ bg: "black", boxShadow: "md", transform: "scale(1.05)"}}
                    onClick={() => handlePollClick(poll)}>
                    <div className="glass" style={glassLayerStyle} />
                    <Text mb ="4" fontSize="xl" fontWeight="extrabold">{poll.name}</Text>
                    <CountDown duration={Math.floor((poll?.completionDate - (new Date()).getTime())/1000)} />
                    <Text mt="2"> Voting Options:</Text>
                    <HStack spacing={6}>
                      {poll.options.map((option, index) => (
                        <Text fontSize= "lg" fontWeight="extrabold" key={index}>{option.name}</Text>
                      ))}
                    </HStack>            
                  </Box>
                ))
              ) : (
                  <Box flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="3xl"
                    boxShadow="lg"
                    display="flex"
                    w="100%"
                    maxWidth="100%"
                    bg="transparent"
                    position="relative"
                    p={4}
                    zIndex={1}
                    color="ghostwhite">
                    <div className="glass" style={glassLayerStyle} />
                    <Flex
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center">
                      <Text
                        mb="2"
                        fontSize="2xl"
                        fontWeight="extrabold"
                        pl={12}
                        pr={12}
                        pt={14}
                        pb={14}
                      >
                        No Ongoing Polls
                      </Text>
                    </Flex>
                  </Box>

              )}
            </HStack>

                {/* List ongoing votes here */}
              
  
              {/* History */}
              <Heading pl={2} color= "ghostwhite">History </Heading>
              <HStack spacing={4}  w= "100%" justifyContent="flex-start" >
                
                {[...completedPollsKubid].reverse().map((poll, index) => {
                  const totalVotes = poll.options.reduce((total, option) => total + ethers.BigNumber.from(option.votes).toNumber(), 0);
                  
                  const predefinedColors = ['red', 'darkblue', 'yellow', 'purple'];
                  
                  const data = [{ name: 'Options', values: poll.options.map((option, index) => {
                    const color = index < predefinedColors.length ? predefinedColors[index] : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
                    return {
                      value: (ethers.BigNumber.from(option.votes).toNumber() / totalVotes) * 100,
                      color: color
                    };
                  }) }];

                return (
                  <Box key={index} flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="3xl"
                  boxShadow="lg"
                  display="flex"
                  w="30%"
                  minW="30%"
                  maxWidth="30%"
                  bg="transparent"
                  position="relative"
                  color= "ghostwhite"
                  zIndex={1}>

                    <div className="glass" style={glassLayerStyle} />
                    <Text mr="2" mt="4" ml="2 "mb ="2" fontSize={"xl"} fontWeight="extrabold">{poll.name}</Text>
                    <Flex  justifyContent="center">
                      <BarChart  width={200} height={30} layout="vertical" data={data}>
                        <XAxis type="number" hide="true" />
                        <YAxis type="category" dataKey="name" hide="true" />
                      {data[0].values.map((option, index) => (
                        <Bar key={index} dataKey={`values[${index}].value`} stackId="a" fill={option.color} />
                      ))}
                    </BarChart>

                    </Flex>

                    <Text mb="2" fontSize="xl" fontWeight="extrabold">Winner: {poll.winner}</Text>
                  </Box>
                );
              })}
                
              </HStack>
              </VStack>
              </Flex>
              </Flex>
            
  
            {/* Create Vote Form */}

          </TabPanel>
  
          <TabPanel>
            <Grid templateColumns={{ sm: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              {/* Ongoing Polls */}
              <VStack spacing={4}>
              <Heading color="ghostwhite" mt="4"mb="4"size="lg">Ongoing Polls</Heading>
              {(ongoingPollsKubix).map((poll, index) => (
                <Box key={index} flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="3xl"
                  boxShadow="lg"
                  display="flex"
                  w="100%"
                  maxWidth="90%"
                  bg="transparent"
                  position="relative"
                  p={4}
                  zIndex={1}
                  mt={4} 
                  color= "ghostwhite"  
                  _hover={{ bg: "black", boxShadow: "md", transform: "scale(1.05)"}}
                  onClick={() => handlePollClick(poll)}>
                  <div className="glass" style={glassLayerStyle} />
                  <Text mb ="2" fontSize="2xl" fontWeight="extrabold">{poll.name}</Text>
                  <Text mb="4">{poll.description}</Text>
                  <CountDown duration={Math.floor((selectedPoll?.completionDate - (new Date()).getTime())/1000)} />
                  <Text mt="4">Options:</Text>
                  <VStack spacing={2}>
                    {poll.options.map((option, index) => (
                      <Text key={index}>{option.optionName}</Text>
                    ))}
                  </VStack>
                </Box>
              ))}
            </VStack>
  
              {/* History */}
              <HStack spacing={4}>
                <Heading color="ghostwhite" mt="4"mb="4"size="lg">History</Heading>
                {completedPollsKubix.map((poll, index) => {
                  const totalVotes = poll.options.reduce((total, option) => total + ethers.BigNumber.from(option.votes).toNumber(), 0);
                  
                  const predefinedColors = ['red', 'darkblue', 'yellow', 'purple'];
                  
                  const data = [{ name: 'Options', values: poll.options.map((option, index) => {
                    const color = index < predefinedColors.length ? predefinedColors[index] : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
                    return {
                      value: (ethers.BigNumber.from(option.votes).toNumber() / totalVotes) * 100,
                      color: color
                    };
                  }) }];

                return (
                  <Box key={index} flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="3xl"
                  boxShadow="lg"
                  display="flex"
                  w="100%"
                  maxWidth="90%"
                  bg="transparent"
                  position="relative"
                  p={4}
                  zIndex={1}
                  mt={4} 
                  color= "ghostwhite">
                    <div className="glass" style={glassLayerStyle} />
                    <Text mb ="2" fontSize={"2xl"} fontWeight="extrabold">{poll.name}</Text>
                    <Text mb ="4">{poll.description}</Text>
                    <Flex  justifyContent="center">
                      <BarChart  width={400} height={50} layout="vertical" data={data}>
                        <XAxis type="number" hide="true" />
                        <YAxis type="category" dataKey="name" hide="true" />
                      {data[0].values.map((option, index) => (
                        <Bar key={index} dataKey={`values[${index}].value`} stackId="a" fill={option.color} />
                      ))}
                    </BarChart>

                    </Flex>

                    <Text fontSize="2xl" fontWeight="extrabold">Winner: {poll.winner}</Text>
                  </Box>
                );
              })}
              <Button onClick={loadMoreCompleted}>Load more</Button>
              </HStack>
            </Grid>
            {/* Create Poll Form */}
            <Modal isOpen={showCreatePoll} onClose={handleCreatePollClick}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create a Poll</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack as="form" onSubmit={handleSubmit} spacing={4} mt={8} w="100%">
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      value={proposal.name}
                      onChange={handleInputChange}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      name="description"
                      value={proposal.description}
                      onChange={handleInputChange}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Execution</FormLabel>
                    <Textarea
                      name="execution"
                      value={proposal.execution}
                      onChange={handleInputChange}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Time</FormLabel>
                    <Input
                      type="number"
                      name="time"
                      value={proposal.time}
                      onChange={handleInputChange}
                      required
                    />
                  </FormControl>
                  <FormControl>
                  <FormControl>
                    <FormLabel>Options</FormLabel>
                    <Textarea
                      name="options"
                      value={proposal.options.join(', ')}
                      onChange={handleOptionsChange}
                      placeholder="Option 1, Option 2, Option 3"
                      required
                    />
                  </FormControl>
                  </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" colorScheme="teal" onClick={handleSubmit}
                  isLoading={loadingSubmit}
                  loadingText="Handling Process">
                    Submit Poll
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </TabPanel>
        </TabPanels>
      </Tabs>
  
      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent
      alignItems="center"
      justifyContent="center"
      borderRadius="3xl"
      boxShadow="lg"
      display="flex"
      w="100%"
      maxWidth="40%"
      bg="transparent"
      position="relative"
      p={4}
      zIndex={1}
      mt="10%"
      color="ghostwhite"
  >
    <div className="glass" style={glassLayerStyle} />
    <ModalHeader fontWeight={"extrabold"} fontSize={"2xl"}>{selectedPoll?.name}</ModalHeader>
    <ModalCloseButton />
<ModalBody>
  <VStack spacing={6}>

    
    {/* Description Section */}
    <VStack spacing={2} alignItems="start">
      <Text fontWeight="bold" fontSize="lg">Description:</Text>
      <Text fontSize="md">{selectedPoll?.description}</Text>
    </VStack>
    
    {/* Time Details Section */}
    <VStack spacing={2} alignItems="start">
    </VStack>

    {/* Voting Options Section */}
    <VStack spacing={4} alignItems="start">
      <Text fontWeight="bold" fontSize="lg">Voting Options:</Text>
      <RadioGroup onChange={setSelectedOption} value={selectedOption}>
        <VStack spacing={3}>
          {selectedPoll?.options?.map((option, index) => (
            <Radio key={index} value={index}>
              {option.name} (Votes: {ethers.BigNumber.from(option.votes).toNumber()})
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </VStack>
  </VStack>
</ModalBody>



    <ModalFooter>
      <Button colorScheme="blue" onClick={() => handleVote(onClose)} mr={3} isLoading={loadingVote} loadingText="Handling Vote">
        Vote
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
</Container>
</>
);
  
};

export default Voting;
