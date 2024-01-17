import { createContext, useContext, useState, useCallback } from "react";

const graphVotingContext = createContext();

export const useGraphVotingContext = () => {
    return useContext(graphVotingContext);
};

export const GraphVotingProvider = ({ children }) => {
    const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/hudsonhrh/kubidao';

    const [skipCount, setSkipCount] = useState(0); // For pagination
    const [kubidProposals, setKubidProposals] = useState([]); 


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

    async function queryKubidVotesInitial() {
        const KUBID_VOTES_QUERY = `
        {
            proposals(
                first: 10
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

        setKubidProposals(fetchedData);
        setSkipCount(10);
        console.log('fetchedData', fetchedData);
        
    }

    const loadMore = useCallback(() => {
        queryKubidVotes();
        setSkipCount(skipCount + 10);
    }, [skipCount]);

    const value = {
        loadMore,
        queryKubidVotesInitial,
        kubidProposals,
    };

    return (
        <graphVotingContext.Provider value={value}>
            {children}
        </graphVotingContext.Provider>
    );
}
