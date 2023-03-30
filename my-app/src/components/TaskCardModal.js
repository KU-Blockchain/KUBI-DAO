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
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import EditTaskModal from './EditTaskModal';

const TaskCardModal = ({ isOpen, onClose, task, columnId, onEditTask }) => {
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

  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  const handleOpenEditTaskModal = () => {
    setIsEditTaskModalOpen(true);
  };

  const handleCloseEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{task.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold">KUBIX Payout: ${task.kubixPayout}</Text>
            <Text>{task.description}</Text>
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
              <Button variant="outline" onClick={handleOpenEditTaskModal}>
                Edit
              </Button>
            )}
            <Button onClick={handleButtonClick} colorScheme="teal">
              {buttonText()}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {columnId === 'open' && (
        <EditTaskModal
          isOpen={isEditTaskModalOpen}
          onClose={handleCloseEditTaskModal}
          onEditTask={onEditTask}
          task={task}
        />
      )}
    </>
  );
};

export default TaskCardModal;
