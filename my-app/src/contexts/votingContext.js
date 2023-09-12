import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ipfs from '../db/ipfs';

import KubixVotingABI from '../abi/KubixVoting.json';
import KubidVotingABI from '../abi/KubidVoting.json';

import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useWeb3Context } from '@/contexts/Web3Context';

import { useToast } from '@chakra-ui/react';



const votingContext = createContext();

export const useVoting = () => {
    return useContext(votingContext);
  };
  
  
export const VotingProvider = ({ children }) => {
    const { hasExecNFT, hasMemberNFT, signerUniversal, providerUniversal, account}= useWeb3Context()
    const {findMinMaxKubixBalance} = useDataBaseContext()

    const contractXAddress = '0x4Af0e1994c8e03414ffd523aAc645049bcdadbD6';
    const contractX = new ethers.Contract(contractXAddress, KubixVotingABI.abi, signerUniversal);
    const contractD = new ethers.Contract('0x9E8A6552E838bF80a4FC7B5Ae834a41ab93354Ff', KubidVotingABI.abi, signerUniversal);

    const [contract, setContract] = useState(contractD);

    const [loadingVote, setLoadingVote] = useState(false)

    const [selectedPoll, setSelectedPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const [ongoingPollsKubix, setOngoingPollsKubix] = useState([]);
    const [completedPollsKubix, setCompletedPollsKubix] = useState([]);
    const [ongoingPollsKubid, setOngoingPollsKubid] = useState([]);
    const [completedPollsKubid, setCompletedPollsKubid] = useState([]);

    const [completedEnd, setCompletedEnd] = useState(3);

    const [totalCompletedCount, setTotalCompletedCount] = useState(0);

    const [proposal, setProposal] = useState({ name: '', description: '', execution: '', time: 0, options: [] ,id:0 });



    const [showCreateVote, setShowCreateVote] = useState(false);
    const [showCreatePoll, setShowCreatePoll] = useState(false);
    const [blockTimestamp, setBlockTimestamp] = useState(0);

    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [votingDataX, setVotingDataX] = useState(null)
    const [votingDataD, setVotingDataD] = useState(null)

    const [voteHashX, setVoteHashX] = useState(null)
    const [voteHashD, setVoteHashD] = useState(null)
    const [hashLoaded, setHashLoaded] = useState(null)

    const[votingLoaded, setVotingLoaded] = useState(false);


    const toast = useToast();

    async function fetchFromIpfs(ipfsHash) {
      for await (const file of ipfs.cat(ipfsHash)) {
        const stringData = new TextDecoder().decode(file);

        return JSON.parse(stringData);
      }
    }

    const fetchDataIPFS = async () => {

      const ipfsHashD = await contractD.getIPFSHash();
      setVoteHashD(ipfsHashD);
      console.log(ipfsHashD)
  
      // Fetch data for contractD only if ipfsHashD is not null
      if (ipfsHashD) {
        const votingDataD = await fetchFromIpfs(ipfsHashD);
        setVotingDataD(votingDataD);
      }

      const ipfsHashX = await contractX.getIPFSHash();
      setVoteHashX(ipfsHashX);
      console.log(ipfsHashX)
  
      // Fetch data for contractX only if ipfsHashX is not null
      if (ipfsHashX) {
        const votingDataX = await fetchFromIpfs(ipfsHashX);
        setVotingDataX(votingDataX);
      }
  

      setHashLoaded(true)

  };
  

    

  const newPollIPFS = async () => {
    try {
      let existingVotingData, setVotingDataFunc, setVoteHashFunc, contractFunc;
  
      // Determine which contract is currently in use
      if (contract.address === contractXAddress) {
        existingVotingData = votingDataX || {};
        setVotingDataFunc = setVotingDataX;
        setVoteHashFunc = setVoteHashX;
        contractFunc = contractX;
      } else {
        existingVotingData = votingDataD || {};
        setVotingDataFunc = setVotingDataD;
        setVoteHashFunc = setVoteHashD;
        contractFunc = contractD;
      }
  
      // Find the maximum poll ID
      let maxId = existingVotingData.polls
        ? Math.max(-1, ...existingVotingData.polls.map(p => p.id))
        : -1;
  
      const currentDateTime = new Date();
      const completionDateTime = currentDateTime.getTime() + proposal.time * 60000;
  
      // Create new poll data
      const newPollData = {
        name: proposal.name,
        description: proposal.description,
        execution: proposal.execution,
        time: proposal.time,
        options: proposal.options.map(option => ({ name: option, votes: 0 })),  // Assuming each option is just a name
        id: maxId+1,
        winner: null,
        completionDate: completionDateTime,
        creationDate: currentDateTime.getTime()
      
      };
  
      existingVotingData.polls = existingVotingData.polls || [];
      existingVotingData.polls.push(newPollData);
  
      // Upload updated data to IPFS
      const ipfsResult = await ipfs.add(JSON.stringify(existingVotingData));
      const newIpfsHash = ipfsResult.path;
  
      // Update the new IPFS hash in the smart contract
      const tx = await contractFunc.setIPFSHash(newIpfsHash);
      await tx.wait();
  
      // Update local state
      setVoteHashFunc(newIpfsHash);
      console.log(existingVotingData)
      setVotingDataFunc({ ...existingVotingData });

  
      toast({
        title: 'Poll Created',
        description: 'Your new poll has been added to IPFS and the smart contract.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
    } catch (error) {
      console.error(error);
  
      toast({
        title: 'Error Creating Poll',
        description: 'There was an error creating the poll. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  


    




const updateVoteInIPFS = async (pollId, selectedOption) => {
  try {
    // Convert BigNumber pollId to a regular number

    let existingVotingData = contract.address === contractXAddress ? votingDataX : votingDataD;
    console.log(existingVotingData);

    // Update the relevant poll with the new vote count
    existingVotingData.polls.forEach(poll => {
      console.log(poll.id, pollId);
      if (poll.id === pollId) {
        console.log(poll.options, selectedOption);// the array has [0]
        if (poll.options[selectedOption]) {
          console.log(poll.options[selectedOption].votes);
          poll.options[selectedOption].votes += 1;
        }
      }
    });

    // Upload the updated data to IPFS
    const ipfsResult = await ipfs.add(JSON.stringify(existingVotingData));
    const newIpfsHash = ipfsResult.path;

    // Update the new IPFS hash in the smart contract
    const tx = await contract.setIPFSHash(newIpfsHash);
    await tx.wait();

    // Update local state
    if (contract.address === contractXAddress) {
      setVoteHashX(newIpfsHash);
      setVotingDataX(existingVotingData);
    } else {
      setVoteHashD(newIpfsHash);
      setVotingDataD(existingVotingData);
    }
  } catch (error) {
    console.error(error);

    toast({
      title: 'Error Updating Vote',
      description: 'There was an error updating the vote in IPFS. Please try again.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};

  


    const handleVote = async (onClose) => {
      if (!hasMemberNFT) {
        toast({
            title: 'Error',
            description: 'You must own a membership NFT to vote',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        setLoadingVote(false);
        return;
    }
        setLoadingVote(true)
        if (selectedOption === null) {
          toast({
            title: 'Error',
            description: 'Please select an option to vote',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
    
          setLoadingVote(false)
          return;
        }
        
        try {
          // Call the vote function from the contract
          console.log(selectedPoll.id, account, selectedOption[0])


          const tx = await contract.vote(selectedPoll.id, account, selectedOption[0]);
          await tx.wait();

          await updateVoteInIPFS(selectedPoll.id, selectedOption[0]);
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
    
        setLoadingVote(false)
      };

      const createPoll = async () => {



        if (contract.address == contractXAddress) {
          const balances = await findMinMaxKubixBalance();
      
        
          // Parse the options string into an array
          const optionsArray = proposal.options.map(option => option.trim());

          console.log(proposal.time)
        
          const tx = await contract.createProposal(proposal.name, proposal.description, proposal.execution, balances.maxBalance, balances.minBalance, proposal.time, optionsArray);
          await tx.wait();
          await newPollIPFS();
        } 
        else {
    
          // Parse the options string into an array
          const optionsArray = proposal.options.map(option => option.trim());

          console.log(proposal.time)
        
          const tx = await contract.createProposal(proposal.name, proposal.description, proposal.execution, proposal.time, optionsArray);
          await tx.wait();
          await newPollIPFS();
    
        }
        
    
      };
      const updatePollIPFS = async (pollToUpdate) => {
        try {
          let existingVotingData = contract.address === contractXAddress ? votingDataX : votingDataD;
      
          // Find the poll with the given ID and update the winner
          const updatedPolls = existingVotingData.polls.map(poll => {
            if (poll.id === pollToUpdate.id) {
              return { ...poll, winner: pollToUpdate.winner };
            }
            return poll;
          });
      
          // Update the existing voting data
          existingVotingData.polls = updatedPolls;
      
          // Upload the updated data to IPFS
          const ipfsResult = await ipfs.add(JSON.stringify(existingVotingData));
          const newIpfsHash = ipfsResult.path;

          // Update local state
          if (contract.address === contractXAddress) {
            setVoteHashX(newIpfsHash);
            setVotingDataX(existingVotingData);
          } else {
            setVoteHashD(newIpfsHash);
            setVotingDataD(existingVotingData);
          }
      
          // Update the new IPFS hash in the smart contract
          const tx = await contract.setIPFSHash(newIpfsHash);
          await tx.wait();
      

      
          toast({
            title: 'Poll Updated',
            description: 'The poll has been successfully updated on IPFS and the smart contract.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } catch (error) {
          console.error(error);
      
          toast({
            title: 'Error Updating Poll',
            description: 'There was an error updating the poll on IPFS. Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };
      

      const fetchPollsIPFS = async (selectedContract, setOngoingPollsFunc, setCompletedPollsFunc) => {
        try {
          console.log("fetching polls ipfs");
      
          let ongoingPolls = [];
          let completedPolls = [];
          let existingVotingData = selectedContract.address === contractXAddress ? votingDataX : votingDataD;
          console.log(existingVotingData);
      
          await Promise.all(existingVotingData.polls.map(async (poll) => {
            const currentTime = new Date();
            const completionDate = new Date(poll.completionDate);
            console.log(completionDate, currentTime);
      
            if (poll.winner) {
              completedPolls.push(poll);
            } else if (currentTime > completionDate) {
              console.log("poll completed");
              const tx = await selectedContract.moveToCompleted();
              await tx.wait();  // Wait for the transaction to be confirmed
              console.log("moved to completed");
              
              console.log("poll id",poll.id);
              const winner = await selectedContract.getWinner(poll.id);
              console.log(winner, "got winner");
              poll.winner = winner;
              await updatePollIPFS(poll);
              completedPolls.push({ ...poll, winner });
            } else {
              ongoingPolls.push(poll);
            }
          }));
      
          // Update states after all promises have resolved
          setOngoingPollsFunc([...ongoingPolls]);
          setCompletedPollsFunc([...completedPolls]);
      
        } catch (error) {
          console.error(error);
        }
      };
      
      
      

      const fetchPolls = async (selectedContract, setOngoingPollsFunc, setCompletedPollsFunc, completedStart = 0, completedEnd = 3) => {
        try {
            await selectedContract.moveToCompleted();
    
            // Fetch both active and completed poll counts in parallel
            const [ongoingPollsCount, completedPollsCount] = await Promise.all([
                selectedContract.activeProposalsCount(),
                selectedContract.completedProposalsCount() // Replace with your actual function if different
            ]);
    
            // Calculate how many polls to fetch
            const completedEndModified = Math.min(completedEnd, completedPollsCount);
    
            // Fetch ongoing and completed polls
            const [ongoingPolls, completedPolls] = await Promise.all([
              fetchPollsData(selectedContract, 0, ongoingPollsCount, false),
              fetchPollsData(selectedContract, completedStart, completedEndModified, true)
            ]);
    
            setOngoingPollsFunc(ongoingPolls);
            setCompletedPollsFunc(completedPolls);
            
        } catch (error) {
            console.error(error);
        }
      };

      const fetchPollsData = async (selectedContract, start, end, completed) => {
        const pollsPromises = Array.from({ length: end - start }, async (_, i) => {
            
            var index = start + i;
            if (!completed){
              index++
            }
    
            // Aligning the index to start from 0 for both completed and ongoing polls
            const proposalId = await selectedContract[completed ? "completedProposalIndices" : "activeProposalIndices"](index);
    
    
            const [proposal, optionsCount] = await Promise.all([
                selectedContract.activeProposals(proposalId),
                selectedContract.getOptionsCount(proposalId)
            ]);
    
            const pollOptionsPromises = Array.from({ length: optionsCount }, (_, j) => selectedContract.getOption(proposalId, j));
    
            const pollOptions = await Promise.all(pollOptionsPromises);
    
    
            let pollWithOptions = {
                ...proposal,
                options: pollOptions,
                id: proposalId,
                remainingTime: proposal.timeInMinutes * 60 - (Math.floor(Date.now() / 1000) - proposal.creationTimestamp)
            };
            
            if (completed) {
                const winner = await selectedContract.getWinner(index);
                pollWithOptions = { ...pollWithOptions, winner };
            }
            
            return pollWithOptions;
        });
    
        return await Promise.all(pollsPromises);
    };

    const loadMoreCompleted = () => {
        setCompletedEnd(prevCompletedEnd => prevCompletedEnd + 5);  // Increment completedEnd
        try{
        if (selectedTab === 0) {
          fetchPolls(contractD, setOngoingPollsKubid, setCompletedPollsKubid, 0, completedEnd);
    
        } else if (selectedTab === 1) {
          fetchPolls(contractX, setOngoingPollsKubix, setCompletedPollsKubix, 0, completedEnd);
    
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handleSubmit = async (e) => {
      if (!hasExecNFT) {
        toast({
            title: 'Error',
            description: 'You must be an executive to create a poll',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        return;
    }
        e.preventDefault();
        setLoadingSubmit(true)
        try {
          console.log("handle submit")
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

    //bugs: modal card dispalying last vote, glass modal overlay bad, ongoing votes doesnt have glass properly applied
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
    
        setLoadingSubmit(false)
    };

    async function fetchBlockTimestamp() {
        const currentBlock = await providerUniversal.getBlock('latest');
        setBlockTimestamp(currentBlock.timestamp);
      }

      useEffect(() => {
        if (votingLoaded) {
            console.log("fetching voting data")
          fetchDataIPFS()
        }
      }, [votingLoaded]);


    return (
        <votingContext.Provider value={{setVotingLoaded,hashLoaded, fetchPollsIPFS, fetchDataIPFS, contractX, contractD, contract, setContract,loadingVote, setLoadingVote, selectedPoll, setSelectedPoll,selectedOption, setSelectedOption, ongoingPollsKubix, setOngoingPollsKubix, completedPollsKubix, setCompletedPollsKubix, ongoingPollsKubid, setOngoingPollsKubid, completedPollsKubid, setCompletedPollsKubid, completedEnd, setCompletedEnd, totalCompletedCount, setTotalCompletedCount, proposal, setProposal, showCreateVote, setShowCreateVote, blockTimestamp, setBlockTimestamp, loadingSubmit, setLoadingSubmit, handleVote, createPoll, fetchPolls, fetchPollsData, loadMoreCompleted, handleSubmit, showCreatePoll, setShowCreatePoll  }}>
          {children}
        </votingContext.Provider>
      );

  };