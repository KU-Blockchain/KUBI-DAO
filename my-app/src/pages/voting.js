import React, { useState } from 'react';
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
} from '@chakra-ui/react';

const Voting = () => {
  const [proposal, setProposal] = useState({ name: '', description: '', execution: '' });
  const [selectedTab, setSelectedTab] = useState(0);
  const [showCreateVote, setShowCreateVote] = useState(false);
  const [showCreatePoll, setShowCreatePoll] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the proposal here
    console.log(proposal);
  };

  const handleTabsChange = (index) => {
    setSelectedTab(index);
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
                {/* List ongoing polls here */}
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
