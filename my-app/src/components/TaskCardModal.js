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
  Box,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import EditTaskModal from './EditTaskModal';
import { useTaskBoard } from '../contexts/TaskBoardContext';

const TaskCardModal = ({ isOpen, onClose, task, columnId, onEditTask }) => {
  const [submission, setSubmission] = useState('');
  const { moveTask, addTask, editTask } = useTaskBoard();

  const handleButtonClick = () => {
    if (columnId === 'open') {
      moveTask(task, columnId, 'inProgress', 0); // Move the task to the 'inProgress' column
      onClose(); // Close the modal
    }
    if (columnId === 'inProgress') {
      moveTask(task, columnId, 'inReview', 0);
      onClose();
    }
    if (columnId === 'inReview') {
      moveTask(task, columnId, 'completed', 0);
      onClose();
    }
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

  return task ? (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{task.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            <Box>{task.description}</Box>
            <Text fontWeight="bold">KUBIX Payout: {task.kubixPayout}</Text>
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
          <ModalFooter>
            {columnId === 'open' && (
              <Button variant="outline" onClick={handleOpenEditTaskModal}>
                Edit
              </Button>
            )}
            <Button onClick={handleButtonClick} colorScheme="teal" ml="auto">
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
  ) : null;
};

export default TaskCardModal;
