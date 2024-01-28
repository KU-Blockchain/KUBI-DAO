import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ipfs from '../db/ipfs';

import KubixVotingABI from '../abi/KubixVoting.json';
import KubidVotingABI from '../abi/KubidVoting.json';

import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useWeb3Context } from '@/contexts/Web3Context';
import { useIPFScontext } from '@/contexts/IPFScontext';

import { useToast } from '@chakra-ui/react';



const votingContext = createContext();

export const useVoting = () => {
    return useContext(votingContext);
  };
  
  
export const VotingProvider = ({ children }) => {
    const { hasExecNFT, hasMemberNFT, signerUniversal, providerUniversal, account}= useWeb3Context();
    const {findMinMaxKubixBalance} = useDataBaseContext()
    const {fetchFromIpfs, addToIpfs} = useIPFScontext();

    //set random signer from privat keys
    const privateKeys = [
      process.env.NEXT_PUBLIC_PRIVATE_KEY,
      process.env.NEXT_PUBLIC_PRIVATE_KEY_2,
      process.env.NEXT_PUBLIC_PRIVATE_KEY_3,
    ];
  
    // Generate a random index between 0 and the array length - 1
    const randomIndex = Math.floor(Math.random() * privateKeys.length);

    const [signer, setSigner] = useState(new ethers.Wallet(privateKeys[randomIndex], providerUniversal));

    const contractXAddress = '0x5205F7977D153f0820c916e9380E39B9c6daDa6a';
    const contractX = new ethers.Contract(contractXAddress, KubixVotingABI.abi, signer);
    
    console.log(signer.address)
    
    //contract adress for testing 0xBaE9BDd35904ad365ba6Efb028661241226acd16
    // actual contrct adress 0x819AAcC4536Fe556AF4aB10cCdfcDf3F9224115A
    const contractD = new ethers.Contract('0x819AAcC4536Fe556AF4aB10cCdfcDf3F9224115A', KubidVotingABI.abi, signer);
    const [contract, setContract] = useState(contractD);

    const [loadingVote, setLoadingVote] = useState(false)

    const [selectedPoll, setSelectedPoll] = useState({ name: 'c', description: '', execution: '', time: 0, options: [] ,id:0});
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



    const getWinnerFromContract = async (proposalId) => {
      try {
          const winningOptionIndex = await contract.announceWinner(proposalId);
          return winningOptionIndex;
      } catch (error) {
          console.error('Error fetching winner:', error);
          toast({
              title: 'Error',
              description: 'There was an error fetching the winning option.',
              status: 'error',
              duration: 3000,
              isClosable: true,
          });
          return null;
      }
  };

    

  const newPollIPFS = async () => {
    console.log('Starting newPollIPFS function');
    try {
      console.log('Inside try block');
  
      let existingVotingData, setVotingDataFunc, setVoteHashFunc, contractFunc;
  
      console.log('Determining contract in use');
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
  
      console.log('Finding max poll ID');
      let maxId = existingVotingData.polls
        ? Math.max(-1, ...existingVotingData.polls.map(p => p.id))
        : -1;
  
      const currentDateTime = new Date();
      const completionDateTime = currentDateTime.getTime() + proposal.time * 60000;
  
      console.log('Creating new poll data');
      const newPollData = {
        name: proposal.name,
        description: proposal.description,
        execution: proposal.execution,
        time: proposal.time,
        options: proposal.options.map(option => ({ name: option, votes: 0 })),  
        id: maxId + 1,
        winner: null,
        completionDate: completionDateTime,
        creationDate: currentDateTime.getTime()
      };
  
      console.log('Pushing new poll data to existing data');
      existingVotingData.polls = existingVotingData.polls || [];
      existingVotingData.polls.push(newPollData);
  
      console.log('Uploading updated data to IPFS');
      const ipfsResult = await addToIpfs(JSON.stringify(existingVotingData));
      const newIpfsHash = ipfsResult.path;
      
  
      console.log('Updating IPFS hash in smart contract');
      const tx = await contractFunc.setIPFSHash(newIpfsHash);
      await tx.wait();
  
      console.log('Updating local state');
      setVoteHashFunc(newIpfsHash);
      console.log('New existingVotingData:', existingVotingData);
      setVotingDataFunc({ ...existingVotingData });
  
      console.log('Displaying success toast');
      toast({
        title: 'Poll Created',
        description: 'Your new poll has been added to IPFS and the smart contract.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
    } catch (error) {
      console.error('Caught an error:', error);
  
      console.log('Displaying error toast');
      toast({
        title: 'Error Creating Poll',
        description: 'There was an error creating the poll. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  
    console.log('Exiting newPollIPFS function');
  };
  
  

    
    const voteRetryLimit = 3;
    

    const submitVoteWithRetry = (pollId, account, option, retryCount = 0) => {
      console.log("submitting vote with retry")
      console.log(pollId, account, option)
      return new Promise((resolve, reject) => {
          const attemptVote = async () => {
              try {
                  console.log("submitting vote", pollId, account, option);
                  const tx = await contract.vote(pollId, account, option);
                  console.log("tx", tx);

                  await tx.wait();
                  resolve(true); // Vote submitted successfully
              } catch (error) {
                  if (retryCount < voteRetryLimit) {
                      setTimeout(() => {
                          submitVoteWithRetry(pollId, account, option, retryCount + 1)
                              .then(resolve)
                              .catch(reject);
                      }, 1250 * (retryCount + 1));
                  } else {
                      reject(error);
                  }
              }
          };
  
          attemptVote();
      });
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
          
          setLoadingVote(true);

          if (selectedOption === null) {
              toast({
                  title: 'Error',
                  description: 'Please select an option to vote',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
              });
          
              setLoadingVote(false);
              return;
          }
          
          try {
            console.log("voting");
    
            // const ipfsResult = await updateVoteInIPFSWithRetry(selectedPoll.id, selectedOption[0], account);
            // if (!ipfsResult) {
            //     throw new Error("IPFS voting failed");
            // }
    
            const voteResult = await submitVoteWithRetry(selectedPoll.id, account, selectedOption[0]);
            if (!voteResult) {
                throw new Error("Voting failed");
            }
            onClose();


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
          
          setLoadingVote(false);
      };


      const createPoll = async () => {



        if (contract.address == contractXAddress) {
          const balances = await findMinMaxKubixBalance();
      
        
          // Parse the options string into an array
          const optionsArray = proposal.options.map(option => option.trim());

          console.log(proposal.time)
        
          const tx = await contract.createProposal(proposal.name, proposal.description, proposal.execution, balances.maxBalance, balances.minBalance, proposal.time, optionsArray);
          await tx.wait();
          //await newPollIPFS();
        } 
        else {
    
          // Parse the options string into an array
          console.log("democracy poll creating...")
          const optionsArray = proposal.options.map(option => option.trim());

          console.log(proposal)
        
          const tx = await contract.createProposal(proposal.name, proposal.description, proposal.execution, proposal.time, optionsArray);
          await tx.wait();
          console.log("poll created snart contract")
          //await newPollIPFS();
    
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




    return (
        <votingContext.Provider value={{ getWinnerFromContract, setVotingLoaded,hashLoaded, contractX, contractD, contract, setContract,loadingVote, setLoadingVote, selectedPoll, setSelectedPoll,selectedOption, setSelectedOption, ongoingPollsKubix, setOngoingPollsKubix, completedPollsKubix, setCompletedPollsKubix, ongoingPollsKubid, setOngoingPollsKubid, completedPollsKubid, setCompletedPollsKubid, completedEnd, setCompletedEnd, totalCompletedCount, setTotalCompletedCount, proposal, setProposal, showCreateVote, setShowCreateVote, blockTimestamp, setBlockTimestamp, loadingSubmit, setLoadingSubmit, handleVote, createPoll, handleSubmit, showCreatePoll, setShowCreatePoll  }}>
          {children}
        </votingContext.Provider>
      );

  };
