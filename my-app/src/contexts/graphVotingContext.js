import { createContext, useContext, useState, useCallback } from "react";
import { useWeb3Context } from "./Web3Context";

const graphVotingContext = createContext();

export const useGraphVotingContext = () => {
    return useContext(graphVotingContext);
};

export const GraphVotingProvider = ({ children }) => {
    const {providerUniversal} = useWeb3Context();
    const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/hudsonhrh/kubidao';

    const [skipCount, setSkipCount] = useState(0); // For pagination
    const [kubidOngoingProposals, setKubidOngoingProposals] = useState([]); 
    const [kubidCompletedProposals, setKubidCompletedProposals] = useState([]); 

    async function getCurrentBlockTime(){
        console.log('provider', providerUniversal);

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
    async function queryKubidVotes() {
        
        const KUBID_VOTES_QUERY = `
        {
            proposals(
                first: 10
                skip: ${skipCount}
                orderBy: creationTimestamp
                orderDirection: desc
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

        if (fetchedData && fetchedData.proposals) {
            setKubidProposals(currentProposals => [...currentProposals, ...fetchedData.proposals]);
        }
    }

    async function loadOngoingKubidInitial() {
        const currentBlockTime = await getCurrentBlockTime();
        const KUBID_VOTES_QUERY = `
        {
            proposals(
                first: 10
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

        const fetchedData = await querySubgraph(KUBID_VOTES_QUERY);

        setKubidOngoingProposals(fetchedData);
        setSkipCount(10);
        console.log('ongoing', fetchedData);
        
    }

    async function loadCompletedKubidInitial() {
        const currentBlockTime = await getCurrentBlockTime();
        const KUBID_VOTES_QUERY = `
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
    
        const fetchedData = await querySubgraph(KUBID_VOTES_QUERY);
    
        if (fetchedData && fetchedData.proposals) {
            for (const proposal of fetchedData.proposals) {
                if (!proposal.winnerName) {
                    await getWinner(proposal.id);
                }
            }
    
            setKubidCompletedProposals(fetchedData.proposals);
        }
        setSkipCount(10);
        console.log('completed', fetchedData);
    }
    
    // Define the getWinner function. Need to implment fully 
    async function getWinner(proposalId) {

        console.log(`Getting winner for proposal ${proposalId}`);

    }
    

    const loadMore = useCallback(() => {
        queryKubidVotes();
        setSkipCount(skipCount + 10);
    }, [skipCount]);

    const value = {
        loadMore,
        kubidOngoingProposals,
        kubidCompletedProposals,
        loadOngoingKubidInitial,
        loadCompletedKubidInitial,
    };

    return (
        <graphVotingContext.Provider value={value}>
            {children}
        </graphVotingContext.Provider>
    );
}
