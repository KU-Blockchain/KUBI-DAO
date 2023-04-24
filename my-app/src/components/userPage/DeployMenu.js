import React, { useState } from "react";
import {
  Button,
  Text,
  VStack
} from "@chakra-ui/react";
//add in deployed contract adress pop up
const DeployMenu = ({ deployPMContract, deployKUBIContract, deployKUBIXContract }) => {
  const [showDeployMenu, setShowDeployMenu] = useState(false);

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
