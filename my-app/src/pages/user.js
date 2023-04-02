import { useState, useEffect } from "react";
import Web3 from "web3";
import DirectDemocracyTokenArtifact from "../abi/DirectDemocracyToken.json";

const User = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [email, setEmail] = useState("");
  const [contract, setContract] = useState(null);

  const contractAddress = "0x9B5AE4442654281438aFD95c54C212e1eb5cEB2c";

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

          // Create contract instance
          const contractInstance = new web3.eth.Contract(
            DirectDemocracyTokenArtifact.abi,
            contractAddress
          );
          setContract(contractInstance);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No ethereum browser extension detected");
      }
    };

    connectWallet();
  }, []);

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleJoin = async () => {
    if (email.endsWith("@ku.edu")) {
      if (contract) {
        try {
          const mintTx = await contract.methods.mint().send({ from: account });
          const balance = await contract.methods.balanceOf(account).call();
          console.log("Successfully minted tokens", mintTx);
          alert(`Successfully minted ${balance} tokens`);

        } catch (error) {
          console.error(error);
          alert("Error minting tokens");
        }
      }
    } else {
      alert("Invalid email domain");
    }
  };

  return (
    <div>
      {web3 && <p>Connected to blockchain network</p>}
      <p>Account: {account}</p>
      {contract && <p>Connected to DirectDemocracyToken Contract</p>}
      <input type="email" placeholder="Email" value={email} onChange={handleChange} />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default User;

