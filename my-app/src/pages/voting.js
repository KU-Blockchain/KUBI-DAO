import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Collapse,
  Text,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import KubixVotingABI from '../abi/KubixVoting.json';
import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useToast } from '@chakra-ui/react';


const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
const contract = new ethers.Contract('0xAc143CD035749dbFaA31A16dbDE8e0C78b4f0Ecc', KubixVotingABI.abi, signer);

const Voting = () => {
  const { findMinMaxKubixBalance } = useDataBaseContext();

  const [proposal, setProposal] = useState({ name: '', description: '', execution: '', time: 0, options: [] });
  const [selectedTab, setSelectedTab] = useState(0);
  const [showCreateVote, setShowCreateVote] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [ongoingPolls, setOngoingPolls] = useState([]);
  const [blockTimestamp, setBlockTimestamp] = useState(0);

  const toast = useToast();

  const fetchOngoingPolls = async () => {
    try {
      const pollCount = await contract.proposalsCount();
      const polls = [];

      for (let i = 0; i < pollCount; i++) {
        const poll = await contract.proposals(i);
        polls.push(poll);
      }

      setOngoingPolls(polls);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOngoingPolls();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await createPoll();
      toast({
        title: 'Poll created successfully',
        description: 'Your poll has been created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Reset the form
      setProposal({ name: '', description: '', execution: '', time: 0, options: [] });
      setShowCreatePoll(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error creating poll',
        description: 'There was an error creating the poll. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTabsChange = (index) => {
    setSelectedTab(index);
  };

  const createPoll = async () => {
    //find max and min KUBIX balance

    const balances = await findMinMaxKubixBalance();
    console.log('proposal:', proposal);
    console.log('balances:', balances);

    // Call createProposal function from the contract
    const tx = await contract.createProposal(proposal.name, proposal.description, proposal.execution, balances.maxBalance, balances.minBalance, proposal.time, proposal.options);
    await tx.wait();
    // Refresh proposal list or handle UI updates here
  };

  const handleOptionsChange = (e) => {
    const options = e.target.value.split(', ');
    setProposal({ ...proposal, options });
  };
  
  async function fetchBlockTimestamp() {
    const currentBlock = await provider.getBlock('latest');
    setBlockTimestamp(currentBlock.timestamp);
  }

  useEffect(() => {
    fetchBlockTimestamp();
  }, []);
  
  const ongoingPollsOnly = (polls) => {
    return polls.filter((poll) => {
      console.log(`Poll creationTimestamp: ${poll.creationTimestamp}`);
      console.log(`Block timestamp: ${blockTimestamp}`);
      console.log(`Poll timeInMinutes: ${poll.timeInMinutes}`);
      console.log(`Poll time plus minutes: ${Number(poll.creationTimestamp) + Number(poll.timeInMinutes * 60)}`);

      return blockTimestamp <= Number(poll.creationTimestamp) + Number(poll.timeInMinutes) * 60;
    });
  };
  

  return (
    <Box>
      <VStack spacing={8}>
        <Heading size="xl">{selectedTab === 0 ? 'Democracy Voting (KUBI)' : 'Polling (KUBIX)'}</Heading>
        <Tabs isFitted variant="enclosed" onChange={handleTabsChange}>
          <TabList mb="1em">
            <Tab>Votes</Tab>
            <Tab>Polls</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {/* Ongoing Votes */}
              <VStack spacing={4}>
                <Heading size="md">Ongoing Votes</Heading>
                {/* List ongoing votes here */}
              </VStack>
              <Button onClick={() => setShowCreateVote(!showCreateVote)} mt={4}>
                {showCreateVote ? 'Hide Create Vote Form' : 'Create Vote'}
              </Button>
              <Collapse in={showCreateVote}>
                {/* Create Vote Form */}
                <VStack as="form" onSubmit={handleSubmit} spacing={4} mt={8} w="100%">
                  <Heading size="md">Propose a Vote</Heading>
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
                  <Button type="submit" colorScheme="teal">
                    Submit Proposal
                  </Button>
                </VStack>
              </Collapse>
            </TabPanel>
            <TabPanel>
              {/* Ongoing Polls */}
              <VStack spacing={4}>
                <Heading size="md">Ongoing Polls</Heading>
                {/* Step 4: Display ongoing polls in the Ongoing Polls section. */}
                {ongoingPollsOnly(ongoingPolls).map((poll, index) => (
                  <Box key={index} borderWidth={1} borderRadius="lg" p={4}>
                    <Text fontWeight="bold">{poll.name}</Text>
                    <Text>{poll.description}</Text>
                    <Text>{poll.execution}</Text>
                    <Text>Time: {}</Text>
                    <Text>Options: {}</Text>
                    <Text>Min Balance: {}</Text>
                  </Box>
                ))}
              </VStack>
              <Button onClick={() => setShowCreatePoll(!showCreatePoll)} mt={4}>
                {showCreatePoll ? 'Hide Create Poll Form' : 'Create Poll'}
              </Button>
              <Collapse in={showCreatePoll}>
                {/* Create Poll Form */}
                <VStack as="form" onSubmit={handleSubmit} spacing={4} mt={8} w="100%">
                  <Heading size="md">Create a Poll</Heading>
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
                    <FormLabel>Options</FormLabel>
                    <Textarea
                      name="options"
                      value={proposal.options.join(', ')}
                      onChange={handleOptionsChange}
                      placeholder="Option 1, Option 2, Option 3"
                      required
                    />
                  </FormControl>
                  <Button type="submit" colorScheme="teal">
                    Submit Poll
                  </Button>
                </VStack>
              </Collapse>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <VStack>
          <Heading size="md">History</Heading>
          {/* List completed votes and polls here */}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Voting;
