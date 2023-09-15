import React, { useState, memo } from "react";
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
import { useWeb3Context } from "@/contexts/Web3Context";
import { useToast } from "@chakra-ui/react";

const MintMenu = memo(() => {
  const [showMintMenu, setShowMintMenu] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const [mintType, setMintType] = useState("");

  const { execNftContract, account, kubiMembershipNFTContract } = useWeb3Context();
  const toast = useToast();

  const openMintModal = (type) => {
    setMintType(type);
    setIsMintModalOpen(true);
  };

  const closeMintModal = () => {
    setIsMintModalOpen(false);
    setMintAddress("");
  };

   const mintExecutiveNFT = async () => {
    if (!execNftContract) return;
    try {
      console.log(account)
      await execNftContract.methods.mint(mintAddress).send({ from: account });
      toast({ title: "Success", description: "Successfully minted Executive NFT", status: "success", duration: 5000, isClosable: true });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Error minting Executive NFT", status: "error", duration: 5000, isClosable: true });
    }
    closeMintModal();
  };

  const mintMemberNFT = async () => {
    if (!kubiMembershipNFTContract) return;
    try {
      console.log(account)
      await kubiMembershipNFTContract.methods. mintMembershipNFT(mintAddress, 2023, 0, "yes").send({ from: account });
      toast({ title: "Success", description: "Successfully minted Member NFT", status: "success", duration: 5000, isClosable: true });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Error minting Member NFT", status: "error", duration: 5000, isClosable: true });
    }
    closeMintModal();
  };

  return (
    <VStack spacing={4}>
      <Button mt={4} colorScheme="blue" onClick={() => setShowMintMenu(!showMintMenu)}>
        Mint Menu
      </Button>
      {showMintMenu && (
        <>
          <Button colorScheme="purple" onClick={() => openMintModal("executive")}>
            Mint Executive NFT
          </Button>
          <Button colorScheme="green" onClick={() => openMintModal("member")}>
            Mint Membership NFT
          </Button>
        </>
      )}

      <Modal isOpen={isMintModalOpen} onClose={closeMintModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint {mintType === "executive" ? "Executive" : "Membership"} NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
            <Button colorScheme={mintType === "executive" ? "blue" : "green"} mr={3} onClick={mintType === "executive" ? mintExecutiveNFT : mintMemberNFT}>
              Mint
            </Button>
            <Button onClick={closeMintModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
});

export default MintMenu;
