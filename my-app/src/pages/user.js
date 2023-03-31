import { useState, useEffect } from "react";
import Web3 from "web3";

const User = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");

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

  return (
    <div>
      {web3 && <p>Connected to blockchain network</p>}
      <p>Account: {account}</p>
    </div>
  );
};

export default User;


