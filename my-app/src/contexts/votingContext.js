import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ipfs from '../db/ipfs';

import KubixVotingABI from '../abi/KubixVoting.json';
import KubidVotingABI from '../abi/KubidVoting.json';

import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useWeb3Context } from '@/contexts/Web3Context';

import { useToast } from '@chakra-ui/react';
import { set } from 'lodash';



const votingContext = createContext();

export const useVoting = () => {
    return useContext(votingContext);
  };
  
  
export const VotingProvider = ({ children }) => {
    const {signerUniversal, providerUniversal, account}= useWeb3Context()
    const {findMinMaxKubixBalance} = useDataBaseContext()

    const contractXAddress = '0x4Af0e1994c8e03414ffd523aAc645049bcdadbD6';
    const contractX = new ethers.Contract(contractXAddress, KubixVotingABI.abi, signerUniversal);
    const contractD = new ethers.Contract('0x4F30A625Ddd488b310B453E1488eBF0074c5dBd6', KubidVotingABI.abi, signerUniversal);

    const [contract, setContract] = useState(contractX);

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


    const toast = useToast();

    const fetchDataIPFS = async () => {

      const ipfsHashX = await contractX.getIPFSHash();
      setVoteHashX(ipfsHashX);
  
      // Fetch data for contractX only if ipfsHashX is not null
      if (ipfsHashX) {
          const votingDataX = await JSON.parse(await (await fetch(`https://kubidao.infura-ipfs.io/ipfs/${ipfsHashX}`)).text());
          setVotingDataX(votingDataX);
      }
  
      const ipfsHashD = await contractD.getIPFSHash();
      setVoteHashD(ipfsHashD);
  
      // Fetch data for contractD only if ipfsHashD is not null
      if (ipfsHashD) {
          const votingDataD = await JSON.parse(await (await fetch(`https://kubidao.infura-ipfs.io/ipfs/${ipfsHashD}`)).text());
          setVotingDataD(votingDataD);
      }
  };
  

    

      const newPollIPFS = async () => {
        try {
            //Fetch existing data from IPFS
            const existingDataHash = contract.address === contractXAddress ? voteHashX : voteHashD;
            const existingVotingData = await fetch(`https://kubidao.infura-ipfs.io/ipfs/${existingDataHash}`).then(response => response.json());
            
            // Append the new poll to the existing voting data
            const newPollData = {
                // Your new poll data goes here
                name: proposal.name,
                description: proposal.description,
                execution: proposal.execution,
                time: proposal.time,
                options: proposal.options,
                id: proposal.id
            };
    
            existingVotingData.polls = existingVotingData.polls || [];  // Initialize if it doesn't exist yet
            existingVotingData.polls.push(newPollData);
            
            // Step 3: Upload updated data to IPFS
            const ipfsResult = await ipfs.add(JSON.stringify(existingVotingData));
            const newIpfsHash = ipfsResult.path;
            
            // Step 4: Update the new IPFS hash in the smart contract
            const tx = await contract.setIPFSHash(newIpfsHash);
            await tx.wait();
    
            // Optionally, update the local state
            if (contract.address === contractXAddress) {
                setVoteHashX(newIpfsHash);
                setVotingDataX(existingVotingData);
            } else {
                setVoteHashD(newIpfsHash);
                setVotingDataD(existingVotingData);
            }
    
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
    

    useEffect(() => {
      fetchDataIPFS()
    }, []);


    const handleVote = async (onClose) => {
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
          console.log(account)
          const tx = await contract.vote(selectedPoll.id, account, selectedOption[0]);
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
    
        setLoadingVote(false)
      };

      const createPoll = async () => {


        if (contract.address == contractXAddress) {
        const balances = await findMinMaxKubixBalance();
    
      
        // Parse the options string into an array
        const optionsArray = proposal.options.map(option => option.trim());
      
        const tx = await contract.createProposal(proposal.name, proposal.description, proposal.execution, balances.maxBalance, balances.minBalance, proposal.time, optionsArray);
        await tx.wait();
        } 
        else {
    
          // Parse the options string into an array
          const optionsArray = proposal.options.map(option => option.trim());
        
          const tx = await contract.createProposal(proposal.name, proposal.description, proposal.execution, proposal.time, optionsArray);
          await tx.wait();
          await newPollIPFS();
    
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
          fetchPolls();
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


    return (
        <votingContext.Provider value={{contractX, contractD, contract, setContract,loadingVote, setLoadingVote, selectedPoll, setSelectedPoll,selectedOption, setSelectedOption, ongoingPollsKubix, setOngoingPollsKubix, completedPollsKubix, setCompletedPollsKubix, ongoingPollsKubid, setOngoingPollsKubid, completedPollsKubid, setCompletedPollsKubid, completedEnd, setCompletedEnd, totalCompletedCount, setTotalCompletedCount, proposal, setProposal, showCreateVote, setShowCreateVote, blockTimestamp, setBlockTimestamp, loadingSubmit, setLoadingSubmit, handleVote, createPoll, fetchPolls, fetchPollsData, loadMoreCompleted, handleSubmit, showCreatePoll, setShowCreatePoll  }}>
          {children}
        </votingContext.Provider>
      );

  };