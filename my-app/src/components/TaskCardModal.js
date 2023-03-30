import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';


const TaskCardModal = ({ isOpen, onClose, name, description, kubixPayout, columnId }) => {
  const [submission, setSubmission] = useState('');

  const handleButtonClick = () => {
    // Handle button click based on columnId
  };

  const buttonText = () => {
    switch (columnId) {
      case 'open':
        return 'Claim';
      case 'inProgress':
        return 'Submit';
      case 'inReview':
        return 'Complete Review';
      case 'completed':
        return <CheckIcon />;
      default:
        return '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold">KUBIX Payout: ${kubixPayout}</Text>
          <Text>{description}</Text>
          {columnId === 'inProgress' && (
            <FormControl mt={4}>
              <FormLabel>Submission:</FormLabel>
              <Input
                placeholder="Type your submission here"
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
              />
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          {columnId === 'open' && (
            <Button variant="outline">
              Edit
            </Button>
          )}
          <Button onClick={handleButtonClick} colorScheme="teal">
            {buttonText()}
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
};

export default TaskCardModal;
