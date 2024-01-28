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
  Box,
  VStack,
  Flex,
  Spacer,
  Toast,
  useToast,
  Textarea, 
  useDisclosure,
  Text
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import EditTaskModal from './EditTaskModal';
import { useTaskBoard } from '../../contexts/TaskBoardContext';
import { useWeb3Context } from '../../contexts/Web3Context';
import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useRouter } from 'next/router';

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .87)",
};

const TaskCardModal = ({task, columnId, onEditTask }) => {
  const [submission, setSubmission] = useState('');
  const { moveTask, deleteTask} = useTaskBoard();
  const { hasExecNFT,hasMemberNFT, account, mintKUBIX} = useWeb3Context();

  const { getUsernameByAddress,setSelectedProjectId } = useDataBaseContext();

  const router = useRouter();
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(()=>{
    if(router.query.task === task.id){
      onOpen();
      console.log("project id",router.query.task.projectId)
      if(router.query.task.projectId){
        
        setSelectedProjectId(router.query.task.projectId)

      }
      
    } else {
      onClose();
    }
  },[router.query.task, task.id]);
  
  const handleCloseModal = () => {
    onClose();
      router.push({ pathname: '/tasks' }, undefined, { shallow: true });
  };


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

  const copyLinkToClipboard = () => {
    // You can construct the link based on your application's routing structure.
    // Here, I'm assuming that the link structure is /tasks/[task-id]
    const link = `${window.location.origin}/tasks/?task=${task.id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast({
        title: "Link copied",
        description: "Task link copied to clipboard.",
        status: "success",
        duration: 3000,
        isClosable: true
      });
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "There was an issue copying the link.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      console.error('Failed to copy link: ', err);
    });
  }
  
  

  return  task ? (
    <>
      <Modal  isOpen={isOpen} onClose={handleCloseModal} size="3xl">
      <ModalOverlay />
      <ModalContent bg="transparent" textColor="white" >
      <div className="glass" style={glassLayerStyle} />
        <Flex alignItems="center" justifyContent="space-between">
          {task.claimedBy && (
            <Text fontSize="sm" mr={12}>
              Claimed By: {task.claimerUsername}
            </Text>
          )}
        </Flex>
        <ModalCloseButton />

          <Box  pt={4} borderTopRadius="2xl" bg="transparent" boxShadow="lg" position="relative" zIndex={-1}>
          <div className="glass" style={glassLayerStyle} />
           <Text ml="6" fontSize="2xl" fontWeight="bold">{task.name}</Text>
          </Box>

          <ModalBody >
            <VStack spacing={4} align="start">
              <Box>
                <Text mb="4" mt="4" lineHeight="6" fontSize="md" fontWeight="bold" style={{ whiteSpace: 'pre-wrap' }}>{task.description}</Text>
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
          <ModalFooter borderTop="1.5px solid" borderColor="gray.200" py={2}>
            <Box flexGrow={1}>
              <Text fontWeight="bold" fontSize="m">
                KUBIX: {task.kubixPayout}
              </Text>
            </Box>
            <Box>
              <Button variant="outline" onClick={copyLinkToClipboard} mr={2}>
                Share
              </Button>
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