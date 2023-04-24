import React, { useState, useEffect } from 'react';

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
  Flex,
  Spacer,
  Toast,
  useToast,
  Textarea
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import EditTaskModal from './EditTaskModal';
import { useTaskBoard } from '../../contexts/TaskBoardContext';
import { useWeb3Context } from '../../contexts/Web3Context';
import { useDataBaseContext } from '@/contexts/DataBaseContext';

const TaskCardModal = ({ isOpen, onClose, task, columnId, onEditTask }) => {
  const [submission, setSubmission] = useState('');
  const { moveTask, deleteTask} = useTaskBoard();
  const { hasExecNFT,hasMemberNFT, account, mintKUBIX} = useWeb3Context();

  const { getUsernameByAddress } = useDataBaseContext();
  




  const toast= useToast();

  const handleButtonClick =  async() => {
    if (columnId === 'open') {
      
      if (hasMemberNFT) {
        moveTask(task, columnId, 'inProgress', 0, " ", account);
      } else {
         alert('You must own an NFT to claim this task. Go to user to join ');
      }
    }
    if (columnId === 'inProgress') {
      if(submission===""){
        toast({
          title:"Invalid Submission",
          description: "Please Enter a submission",
          status: "error",
          duration: 3500,
          isClosable: true
        });
        return;
      }
      else if (hasMemberNFT) {
        moveTask(task, columnId, 'inReview', 0, submission);
        onClose();
      }
      else {
         alert('You must own an NFT to submit. Go to user to join');
      }
    }
    if (columnId === 'inReview') {
      if (hasExecNFT) {
        try {
          onClose();
          await moveTask(task, columnId, 'completed', 0)
          console.log(task.claimedBy)
          setTimeout(async() => {await mintKUBIX(task.claimedBy, task.kubixPayout, true)}, 2100);
          
        } catch (error) {
          console.error("Error moving task:", error);
        }
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
  

  return  task ? (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <Flex alignItems="center" justifyContent="space-between">
          <Box as="h2" fontWeight="bold" ml="4" mt="2" fontSize="2xl">
            {task.name}
          </Box >
          {task.claimedBy && (
            <Text fontSize="sm" mr={12}>
              Claimed By: {task.claimerUsername}
            </Text>
          )}
        </Flex>
        <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  Description:
                </Text>
                <Text>{task.description}</Text>
              </Box>
              {columnId === 'inProgress' && (
                <FormControl>
                  <FormLabel fontWeight="bold" fontSize="lg">
                    Submission:
                  </FormLabel>
                  <Textarea
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