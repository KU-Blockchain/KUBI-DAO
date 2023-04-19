import React, { useState } from "react";
import {
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";

const MintMenu = ({ mintExecutiveNFT }) => {
  const [showMintMenu, setShowMintMenu] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [mintAddress, setMintAddress] = useState("");

  const openMintModal = () => {
    setIsMintModalOpen(true);
  };

  const closeMintModal = () => {
    setIsMintModalOpen(false);
    setMintAddress("");
  };

  return (
    <VStack spacing={4}>
      <Button colorScheme="blue" onClick={() => setShowMintMenu(!showMintMenu)}>
        Mint Menu
      </Button>
      {showMintMenu && (
        <Button colorScheme="purple" onClick={openMintModal}>
          Mint Executive NFT
        </Button>
      )}

      <Modal isOpen={isMintModalOpen} onClose={closeMintModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint Executive NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          >
            <FormControl id="mintAddress">
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                placeholder="Enter address to mint to"
                value={mintAddress}
                onChange={(event) => setMintAddress(event.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={mintExecutiveNFT}>
              Mint
            </Button>
            <Button onClick={closeMintModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default MintMenu;
