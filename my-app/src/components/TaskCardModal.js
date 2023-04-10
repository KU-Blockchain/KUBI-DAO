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
  VStack,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import EditTaskModal from './EditTaskModal';
import { useTaskBoard } from '../contexts/TaskBoardContext';
import { useWeb3Context } from '../contexts/Web3Context';

const TaskCardModal = ({ isOpen, onClose, task, columnId, onEditTask }) => {
  const [submission, setSubmission] = useState('');
  const { moveTask, deleteTask} = useTaskBoard();
  const { hasExecNFT,hasMemberNFT, account } = useWeb3Context();



  const handleButtonClick =  () => {
    if (columnId === 'open') {
      
      if (hasMemberNFT) {
        moveTask(task, columnId, 'inProgress', 0, " ", account);
      } else {
         alert('You must own an NFT to claim this task. Go to user to join ');
      }
    }
    if (columnId === 'inProgress') {
      
      if (hasMemberNFT) {
        moveTask(task, columnId, 'inReview', 0, submission);
        onClose();
      } else {
         alert('You must own an NFT to submit. Go to user to join');
      }
    }
    if (columnId === 'inReview') {
      
      if (hasExecNFT) {
        moveTask(task, columnId, 'completed', 0);
        onClose();
      } else {
         alert('You must be an executive to complete the review');
      }
    }
    if (columnId === 'completed') {
      if (hasExecNFT) {
        deleteTask(task.id, columnId);
      } else {
        alert('You must be an executive to delete task');
      }
      
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
    
    if (hasExecNFT) {
      setIsEditTaskModalOpen(true);
    } else {
       alert('You must be an executive to edit.');
    }
    
  };

  const handleCloseEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
  };
  console.log(task.claimedBy)

  return task ? (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{task.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  Description:
                </Text>
                <Text>{task.description}</Text>
              </Box>
              {task.claimedBy && (
                <Box>
                  <Text fontWeight="bold" fontSize="lg">
                    Claimed By:
                  </Text>
                  <Text>{task.claimedBy}</Text>
                </Box>
              )}
              {columnId === 'inProgress' && (
                <FormControl>
                  <FormLabel fontWeight="bold" fontSize="lg">
                    Submission:
                  </FormLabel>
                  <Input
                    placeholder="Type your submission here"
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                  />
                </FormControl>
              )}
              {(columnId === 'inReview' || columnId === 'completed') && (
                <Box>
                  <Text fontWeight="bold" fontSize="lg">
                    Submission:
                  </Text>
                  <Text>{task.submission}</Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor="gray.200" py={2}>
            <Box flexGrow={1}>
              <Text fontWeight="bold" fontSize="m">
                KUBIX: {task.kubixPayout}
              </Text>
            </Box>
            <Box>
              {columnId === 'open' && (
                <Button variant="outline" onClick={handleOpenEditTaskModal} mr={2}>
                  Edit
                </Button>
              )}
              <Button onClick={handleButtonClick} colorScheme="teal">
                {buttonText()}
              </Button>
            </Box>
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
