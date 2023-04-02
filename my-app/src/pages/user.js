import { useState, useEffect } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import DirectDemocracyTokenArtifact from "../artifacts/contracts/DirectDemocracyToken.sol/DirectDemocracyToken.json";

const User = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });
          // Instantiate web3 object
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          // Get the user's account address
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No ethereum browser extension detected");
      }
    };

    connectWallet();
  }, []);

  const deployContract = async () => {
    if (!web3) {
      console.log("Web3 not initialized");
      return;
    }

    // Create an instance of the ethers.ContractFactory
    const factory = new ethers.ContractFactory(
      DirectDemocracyTokenArtifact.abi,
      DirectDemocracyTokenArtifact.bytecode,
      new ethers.providers.Web3Provider(window.ethereum).getSigner()
    );

    // Deploy the contract
    const contractInstance = await factory.deploy();

    // Wait for the contract deployment to be mined
    await contractInstance.deployTransaction.wait();

    // Update the state with the deployed contract
    setContract(contractInstance);

    console.log("Contract deployed at:", contractInstance.address);
  };

  return (
    <div>
      {web3 && <p>Connected to blockchain network</p>}
      <p>Account: {account}</p>
      <button onClick={deployContract}>Deploy DirectDemocracyToken Contract</button>
      {contract && <p>Contract Address: {contract.address}</p>}
    </div>
  );
};

export default User;
