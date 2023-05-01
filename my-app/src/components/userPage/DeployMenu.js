import React, { useState } from "react";
import {
  Button,
  Text,
  VStack
} from "@chakra-ui/react";
import { useWeb3Context } from "@/contexts/Web3Context";
import ProjectManagerArtifact from "../../abi/ProjectManager.json";
import ExecNFTArtifiact from "../../abi/KUBIExecutiveNFT.json";
import KUBIXArtifact from "../../abi/KUBIX.json";
//add in deployed contract adress pop up
const DeployMenu = () => {
  const [showDeployMenu, setShowDeployMenu] = useState(false);
  const [deployedPMContract, setDeployedPMContract] = useState(null);
  const [deployedKUBIContract, setDeployedKUBIContract] = useState(null);
  const [deployedKUBIXContract, setDeployedKUBIXContract] = useState(null);


  const { web3, account } = useWeb3Context();

  const deployPMContract = async () => {
    if (!web3 || !account) return;
  
    const projectManagerContract = new web3.eth.Contract(ProjectManagerArtifact.abi);
    const deployOptions = {
      data: ProjectManagerArtifact.bytecode,
      arguments: [],
    };
  
    try {
      const instance = await projectManagerContract.deploy(deployOptions).send({ from: account });
      setDeployedPMContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const deployKUBIContract = async () => {
    if (!web3 || !account) return;
  
    const KUBIContract = new web3.eth.Contract(ExecNFTArtifiact.abi);
    const deployOptions = {
      data: ExecNFTArtifiact.bytecode,
      arguments: ["https://ipfs.io/ipfs/QmXrAL39tPc8wWhvuDNNp9rbaWwHPnHhZC28npMGVJvm3N"
    ],
    };
  
    try {
      const instance = await KUBIContract.deploy(deployOptions).send({ from: account });
      setDeployedKUBIContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const deployKUBIXContract = async () => {
    if (!web3 || !account) return;
  
    
    const deployOptions = {
      data: KUBIXArtifact.bytecode,
      arguments: [],
    };
  
    try {
      const instance = await KUBIXcontract.deploy(deployOptions).send({ from: account });
      setDeployedKUBIXContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  return (
    <VStack spacing={4}>
      <Button  colorScheme="orange" onClick={() => setShowDeployMenu(!showDeployMenu)} _hover={{ bg: "orange.600", boxShadow: "md", transform: "scale(1.05)"}}>
        Deploy Menu
      </Button>
      {showDeployMenu && (
        <>
          <Button colorScheme="teal" onClick={deployPMContract} _hover={{ bg: "teal.600", boxShadow: "md", transform: "scale(1.05)"}}>
            Deploy Project Manager Contract
          </Button>
          <Button colorScheme="teal" onClick={deployKUBIContract} _hover={{ bg: "teal.600", boxShadow: "md", transform: "scale(1.05)"}}>
            Deploy Executive NFT Contract
          </Button>
          <Button  colorScheme="teal" onClick={deployKUBIXContract} _hover={{ bg: "teal.600", boxShadow: "md", transform: "scale(1.05)"}}>
            Deploy KUBIX token Contract
          </Button>
        </>
      )}
    </VStack>
  );
};

export default DeployMenu;
