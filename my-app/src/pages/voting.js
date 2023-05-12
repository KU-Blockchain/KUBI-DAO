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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import KubixVotingABI from '../abi/KubixVoting.json';
import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useToast } from '@chakra-ui/react';


const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
const contract = new ethers.Contract('0xAdbc94A86a7C36746Ec87aC9736c52a612d3009b', KubixVotingABI.abi, signer);

const Voting = () => {
  const { findMinMaxKubixBalance } = useDataBaseContext();

  const [proposal, setProposal] = useState({ name: '', description: '', execution: '', time: 0, options: [] ,id:0 });
  const [selectedTab, setSelectedTab] = useState(0);
  const [showCreateVote, setShowCreateVote] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [ongoingPolls, setOngoingPolls] = useState([]);
  const [blockTimestamp, setBlockTimestamp] = useState(0);
  const [completedPolls, setCompletedPolls] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);


  const toast = useToast();

  const handlePollClick = (poll) => {
    setSelectedPoll(poll);
    onOpen();
  };

  const handleVote = async () => {
    if (selectedOption === null) {
      toast({
        title: 'Error',
        description: 'Please select an option to vote',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Call the vote function from the contract
      console.log(selectedPoll.id, signer.address, selectedOption[0])
      const tx = await contract.vote(selectedPoll.id, signer.address, selectedOption[0]);
      await tx.wait();
      toast({
        title: 'Vote submitted',
        description: 'Your vote has been submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'There was an error submitting your vote. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchCompletedPolls = async () => {
    try {
      const completedPollsCount = await contract.completedProposalsCount();
      const polls = [];
  
      for (let i = 0; i < completedPollsCount; i++) {
        const completedProposalIndex = await contract.completedProposalIndices(i);
        const poll = await contract.activeProposals(completedProposalIndex);
        polls.push(poll);

        console.log("completed polls")
      }
  
      setCompletedPolls(polls);
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const fetchOngoingPolls = async () => {
    try {
      await contract.moveToCompleted();
      const pollCount = await contract.activeProposalsCount();
      console.log(pollCount);
      const polls = [];
  
      for (let i = 1; i <= pollCount; i++) {
        const activeProposalIndex = await contract.activeProposalIndices(i);
        const poll = await contract.activeProposals(activeProposalIndex);
  
        const optionsCount = await contract.getOptionsCount(activeProposalIndex);
        const pollOptions = [];
  
        for (let j = 0; j < optionsCount; j++) {
          const option = await contract.getOption(activeProposalIndex, j);
          pollOptions.push(option);
        }
  
        console.log(pollOptions);
  
        // Create a new object that includes all properties from `poll` and adds `options`
        const pollWithOptions = { ...poll, options: pollOptions , id: activeProposalIndex};
        polls.push(pollWithOptions);
      }
      console.log(polls)
      setOngoingPolls(polls);

      for (let i = 0; i < polls.length; i++) {
        console.log(polls[i].options[0].optionName);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  

  useEffect(() => {
    fetchOngoingPolls();
    fetchCompletedPolls();
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
    const balances = await findMinMaxKubixBalance();
    console.log('proposal:', proposal);
    console.log('balances:', balances);
  
    // Parse the options string into an array
    const optionsArray = proposal.options.map(option => option.trim());
  
    const tx = await contract.createProposal(proposal.name, proposal.description, proposal.execution, balances.maxBalance, balances.minBalance, proposal.time, optionsArray);
    await tx.wait();
  };
  
  const handleOptionsChange = (e) => {
    // Split the input string by comma to get an array of options
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
              <VStack>
                <Heading mt={4} size="md">History</Heading>
              </VStack>
            </TabPanel>
            <TabPanel>
              {/* Ongoing Polls */}
              <VStack spacing={4}>
                <Heading size="md">Ongoing Polls</Heading>
                {/* Step 4: Display ongoing polls in the Ongoing Polls section. */}
                {(ongoingPolls).map((poll, index) => (
                  <Box key={index} borderWidth={1} borderRadius="lg" p={4} onClick={() => handlePollClick(poll)}>
                    <Text fontWeight="bold">{poll.name}</Text>
                    <Text>{poll.description}</Text>
                    <Text>{poll.execution}</Text>
                    <Text>Time: {}</Text>
                    <Text>Options: {poll.options[0].optionName}</Text>
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
                  <Button type="submit" colorScheme="teal">
                    Submit Poll
                  </Button>
                </VStack>
              </Collapse>
              <VStack>
                <Heading mt={4} size="md">History</Heading>
                {completedPolls.map((poll, index) => (
                  <Box key={index} borderWidth={1} borderRadius="lg" p={4} >
                    <Text fontWeight="bold">{poll.name}</Text>
                    <Text>{poll.description}</Text>
                    <Text>{poll.execution}</Text>
                    <Text>Time: {}</Text>
                    <Text>Options: {}</Text>
                    <Text>Min Balance: {}</Text>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedPoll?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedPoll?.description}</Text>
            <Text>{selectedPoll?.execution}</Text>
            <Text>Time: {}</Text>
            <Text>Min Balance: {}</Text>
            <Text>Max Balance: {}</Text>
            <RadioGroup onChange={setSelectedOption} value={selectedOption}>
              <Stack spacing={4}>
                {selectedPoll?.options?.map((option, index) => (
                  <Radio key={index} value={index}>
                    {option.optionName}
                  </Radio>
                )) ?? null}
              </Stack>
            </RadioGroup>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleVote}>
              Vote
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    );    
  
};

export default Voting;
