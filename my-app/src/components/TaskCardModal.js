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
import { useWeb3Context } from '../contexts/Web3Context';

const TaskCardModal = ({ isOpen, onClose, task, columnId, onEditTask }) => {
  const [submission, setSubmission] = useState('');
  const { moveTask, deleteTask} = useTaskBoard();
  const { hasNFT } = useWeb3Context();

  const handleButtonClick =  () => {
    if (columnId === 'open') {
      
      if (hasNFT) {
        moveTask(task, columnId, 'inProgress', 0);
        onClose();
      } else {
         alert('You must own an NFT to claim this task. Go to user to join ');
      }
    }
    if (columnId === 'inProgress') {
      
      if (hasNFT) {
        moveTask(task, columnId, 'inReview', 0);
        onClose();
      } else {
         alert('You must own an NFT to submit. Go to user to join');
      }
    }
    if (columnId === 'inReview') {
      
      if (hasNFT) {
        moveTask(task, columnId, 'completed', 0);
        onClose();
      } else {
         alert('You must own an NFT to complete the review. Go to user to join');
      }
    }
    if (columnId === 'completed') {
      deleteTask(task.id, columnId);
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
    
    
    if (hasNFT) {
      setIsEditTaskModalOpen(true);
    } else {
       alert('You must own an NFT to edit. Go to user to join');
    }
    
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
          onDeleteTask={(taskId) => deleteTask(taskId, columnId)}
        />
      )}
    </>
  ) : null;
};

export default TaskCardModal;
