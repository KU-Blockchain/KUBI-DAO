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
      <Button  colorScheme="orange" onClick={() => setShowDeployMenu(!showDeployMenu)}>
        Deploy Menu
      </Button>
      {showDeployMenu && (
        <>
          <Button colorScheme="teal" onClick={deployPMContract}>
            Deploy Project Manager Contract
          </Button>
          <Button colorScheme="teal" onClick={deployKUBIContract}>
            Deploy Executive NFT Contract
          </Button>
          <Button  colorScheme="teal" onClick={deployKUBIXContract}>
            Deploy KUBIX token Contract

          </Button>
        </>
      )}
    </VStack>
  );
};

export default DeployMenu;
