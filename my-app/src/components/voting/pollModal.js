import React, { useState, useEffect } from "react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Button,
    Text,
    VStack,
    Radio,
    RadioGroup,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import CountDown from "./countDown";
import { useRouter } from 'next/router';






const glassLayerStyle = {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: -1,
    borderRadius: "inherit",
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(0, 0, 0, .73)",
  };


const PollModal = ({ onOpen, isOpen, onClose, selectedPoll, handleVote, loadingVote, selectedOption, setSelectedOption }) => {
    const router = useRouter();

    const handleModalClose = () => { 
        onClose();
        router.push('/voting');
    }



    return (
        <Modal  onOpen={onOpen} isOpen={isOpen} onClose={handleModalClose}>
            <ModalOverlay />
            <ModalContent
                alignItems="center"
                justifyContent="center"
                borderRadius="3xl"
                boxShadow="lg"
                display="flex"
                w="100%"
                maxWidth="40%"
                bg="transparent"
                position="relative"
                p={4}
                zIndex={1}
                mt="10%"
                color="ghostwhite"
            >
                <div className="glass" style={glassLayerStyle} />
                <ModalHeader fontWeight={"extrabold"} fontSize={"2xl"}>
                    {selectedPoll?.name}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={6}>
                        {/* Description Section */}
                        <VStack ml="6" mr="6" spacing={2} alignItems="start">
                            <Text fontSize="md">{selectedPoll?.description}</Text>
                        </VStack>

                            <CountDown
                                duration={selectedPoll?.expirationTimestamp - Math.floor(Date.now() / 1000)}
                            />

                        {/* Voting Options Section */}
                        <VStack spacing={4} >
                            <RadioGroup onChange={setSelectedOption} value={selectedOption}>
                                <VStack align="flex-start">
                                    {selectedPoll?.options?.map((option, index) => (
                                        <Radio size="lg" key={index} value={index}>
                                            {option.name} (Votes: {ethers.BigNumber.from(option.votes).toNumber()})
                                        </Radio>
                                    ))}
                                </VStack>
                            </RadioGroup>
                        </VStack>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" onClick={() => handleVote(onClose)} mr={3} isLoading={loadingVote} loadingText="Handling Vote">
                        Vote
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PollModal;