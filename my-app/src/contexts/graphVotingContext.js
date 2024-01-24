import { createContext, useContext, useState, useCallback } from "react";
import { useWeb3Context } from "./Web3Context";
import {useVoting} from "./votingContext";

const graphVotingContext = createContext();

export const useGraphVotingContext = () => {
    return useContext(graphVotingContext);
};

export const GraphVotingProvider = ({ children }) => {
    const {providerUniversal} = useWeb3Context();
    const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/hudsonhrh/kubidao';


    const [skipCountKubidOngoing, setSkipCountKubidOngoing] = useState(0); 
    const [skipCountKubidCompleted, setSkipCountKubidCompleted] = useState(0); 
    const [kubidOngoingProposals, setKubidOngoingProposals] = useState([]); 

    const [kubidCompletedProposals, setKubidCompletedProposals] = useState([]); 

    const {getWinnerFromContract} = useVoting();

    async function getCurrentBlockTime(){

        const block = await providerUniversal.getBlock('latest');
        return block.timestamp;
    }


    async function querySubgraph(query) {
        const response = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error('Error fetching data:', data.errors);
            return null;
        }

        return data.data;
    }

    // change this to load more ongoing and completed
    // also need to update how skip count works for each 
    async function loadMoreKubidOngoing() {
        console.log('load more ongoing');
        const currentBlockTime = await getCurrentBlockTime();
        
        const KUBID_VOTES_QUERY3 = `
        {
            proposals(
                first: 10
                skip: ${skipCountKubidOngoing}
                orderBy: creationTimestamp
                orderDirection: desc
                where: {expirationTimestamp_gt: "${currentBlockTime}"}
            ) {
                id
                name
                description
                execution
                totalVotes
                timeInMinutes
                creationTimestamp
                expirationTimestamp
                winnerName
                options {
                    id
                    optionIndex
                    name
                    votes
                }
            }
        }
        `;

        const fetchedData = await querySubgraph(KUBID_VOTES_QUERY3);

        if (fetchedData && fetchedData.proposals) {
            setKubidOngoingProposals(kubidOngoingProposals => [...kubidOngoingProposals, ...fetchedData.proposals]);
            setSkipCountKubidOngoing(skipCountKubidOngoing + 10);
        }
    }

    async function loadMoreKubidCompleted() {
        console.log('load more completed');
        const currentBlockTime = await getCurrentBlockTime();
        
        const KUBID_VOTES_QUERY2 = `
        {
            proposals(
                first: 10
                skip: ${skipCountKubidCompleted}
                orderBy: creationTimestamp
                orderDirection: desc
                where: {expirationTimestamp_lte: "${currentBlockTime}"}
            ) {
                id
                name
                description
                execution
                totalVotes
                timeInMinutes
                creationTimestamp
                expirationTimestamp
                winnerName
                options {
                    id
                    optionIndex
                    name
                    votes
                }
            }
        }
        `;

        const fetchedData = await querySubgraph(KUBID_VOTES_QUERY2);

        if (fetchedData && fetchedData.proposals) {
            setKubidCompletedProposals(kubidCompletedProposals => [...kubidCompletedProposals, ...fetchedData.proposals]);
            setSkipCountKubidCompleted(skipCountKubidCompleted + 10);
        }
    }

    async function loadOngoingKubidInitial() {
        const currentBlockTime = await getCurrentBlockTime();
        const KUBID_VOTES_QUERY = `
        {
            proposals(
                first: 10
                orderBy: expirationTimestamp
                orderDirection: asc
                where: {expirationTimestamp_gt: "${currentBlockTime}"}
            ) {
                id
                name
                description
                execution
                totalVotes
                timeInMinutes
                creationTimestamp
                expirationTimestamp
                winnerName
                options {
                    id
                    optionIndex
                    name
                    votes
                }
            }
        }
        `;

        const fetchedData = await querySubgraph(KUBID_VOTES_QUERY);

        setKubidOngoingProposals(fetchedData.proposals);
        setSkipCountKubidOngoing(10);
        console.log('ongoing', fetchedData);
        
    }

    async function loadCompletedKubidInitial() {
        const currentBlockTime = await getCurrentBlockTime();
        const KUBID_VOTES_QUERY1 = `
        {
            proposals(
                first: 10
                orderBy: creationTimestamp
                orderDirection: desc
                where: {expirationTimestamp_lte: "${currentBlockTime}"}
            ) {
                id
                name
                description
                execution
                totalVotes
                timeInMinutes
                creationTimestamp
                expirationTimestamp
                winnerName
                options {
                    id
                    optionIndex
                    name
                    votes
                }
            }
        }
        `;
    
        const fetchedData = await querySubgraph(KUBID_VOTES_QUERY1);
    
        if (fetchedData && fetchedData.proposals) {
            for (const proposal of fetchedData.proposals) {
                if (!proposal.winnerName) {
                    await getWinner(proposal.id);
                }
            }
    
            setKubidCompletedProposals(fetchedData.proposals);
        }
        setSkipCountKubidCompleted(10);
        console.log('completed', fetchedData);
    }
    
    // Define the getWinner function. Need to implment fully 
    async function getWinner(proposalId) {

        console.log(`Getting winner for proposal ${proposalId}`);
        const tx= await getWinnerFromContract(proposalId);


    }
    

    const value = {
        kubidOngoingProposals,
        kubidCompletedProposals,
        loadOngoingKubidInitial,
        loadCompletedKubidInitial,
        loadMoreKubidOngoing,
        loadMoreKubidCompleted,
    };

    return (
        <graphVotingContext.Provider value={value}>
            {children}
        </graphVotingContext.Provider>
    );
};

