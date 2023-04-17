import React, { useState, useEffect } from "react";
import Web3 from "web3";
import erc20ABI from "./erc20ABI.json"; // Replace this with the actual path to your ERC20 ABI JSON file

const KubixButton = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [kubixToken, setKubixToken] = useState(null);

  const KUBIX_ADDRESS = "0x894158b1f988602b228E39a633C7A2458A82028A";
  const DECIMALS = 18;

  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        const tokenInstance = new web3Instance.eth.Contract(erc20ABI, KUBIX_ADDRESS);
        setKubixToken(tokenInstance);
      } else {
        alert("Please install MetaMask to use this feature.");
      }
    })();
  }, []);

  const importKubixToken = async () => {
    if (kubixToken && account) {
      try {
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: KUBIX_ADDRESS,
              symbol: "KUBIX",
              decimals: DECIMALS,
              image: "https://kublockchain.com/wp-content/uploads/2021/07/KUBC-logo-CMYK-150.png",
            },
          },
        });
      } catch (error) {
        console.error("Error importing KUBIX token:", error);
        alert("Error importing KUBIX token. Please try again.");
      }
    } else {
      alert("Please connect to MetaMask to use this feature.");
    }
  };

  return (
    <button onClick={importKubixToken} disabled={!web3 || !account}>
      Import KUBIX Token
    </button>
  );
};

export default KubixButton;
