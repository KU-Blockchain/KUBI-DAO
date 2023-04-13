import React, { useState, useEffect, useRef } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton} from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { useTaskBoard } from '../contexts/TaskBoardContext';
import AddTaskModal from './AddTaskModal';
import { useWeb3Context } from '../contexts/Web3Context';
import { useDataBaseContext } from '../contexts/DataBaseContext';

const TaskColumn = ({ title, tasks, columnId }) => {
  const { moveTask, addTask, editTask } = useTaskBoard();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const { hasExecNFT,hasMemberNFT,account } = useWeb3Context();
  const { getUsernameByAddress } = useDataBaseContext();
  const hasMemberNFTRef = useRef(hasMemberNFT);
  const hasExecNFTRef = useRef(hasExecNFT);


  useEffect(() => {
    hasMemberNFTRef.current = hasMemberNFT;
  }, [hasMemberNFT]);

  useEffect(() => {
    hasExecNFTRef.current = hasExecNFT;
  }, [hasExecNFT]);

  
  const handleOpenAddTaskModal = () => {
    if (title === 'Open') {
      
      if (hasExecNFT) {
        setIsAddTaskModalOpen(true);
      } else {
         alert('You must be an executive to add task');
      }
      
    }
    };

    const handleCloseAddTaskModal = () => {
      setIsAddTaskModalOpen(false);
    };
  
    const handleAddTask = (updatedTask) => {
      if (title === 'Open') {
        updatedTask = {
          ...updatedTask,
          id: `task-${Date.now()}`,
          difficulty: updatedTask.difficulty,
          estHours: updatedTask.estHours,
          claimedBy: "",
          claimerUsername: "", 
        };
        addTask(updatedTask, columnId);
      }
    };
    
    

    const handleEditTask = (updatedTask, taskIndex) => {
      updatedTask = {
        ...updatedTask,
        id: `task-${Date.now()}`,
        difficulty: updatedTask.difficulty, 
        estHours: updatedTask.estHours, 
      };
      editTask(updatedTask, columnId, taskIndex);
    };
  
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'task',
      drop: async(item) => {
        
        
        if (!hasMemberNFTRef.current && title != 'Completed') {
          alert('You must own an NFT to move tasks. Go to user to join');
          return;
        }
        else if (!hasExecNFTRef.current && title === 'Completed') {
          alert('You must be an Executive to review tasks.');
          return;
        }
        
  
        if (item.columnId !== columnId) {
          const newIndex = tasks.length;
          console.log(item.claimerUsername)
          const claimedByValue = title === 'In Progress' ? account : item.claimedBy;
          const claimerUserValue = title === 'In Progress' ?  await getUsernameByAddress(account) : item.claimerUsername;
          console.log("claimerUserValue: ", claimerUserValue)
          const draggedTask = {
            ...item,
            id: item.id,
            name: item.name,
            description: item.description,
            difficulty: item.difficulty,
            estHours: item.estHours,
            claimedBy: claimedByValue,
            claimerUsername: claimerUserValue,
          };
          moveTask(draggedTask, item.columnId, columnId, newIndex, item.submission, claimedByValue);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));
  
    const columnStyle = isOver ? { backgroundColor: 'rgba(0, 255, 0, 0.1)' } : {};
  
    return (
      <Box ref={drop} w="100%" h="100%" px={4} py={6} bg="gray.100" borderRadius="md" boxShadow="lg" style={columnStyle}>
        <Heading size="md" mb={4} alignItems="center">
          {title}
          {title === 'Open' && (
            <IconButton
              ml={2}
              icon={<AddIcon />}
              aria-label="Add task"
              onClick={handleOpenAddTaskModal}
              h="1rem"
            />
          )}
        </Heading>
        <Box
          h="calc(100% - 3rem)"
          bg="gray.200"
          borderRadius="md"
          p={4}
          style={columnStyle}
          overflowY="auto"
        >
          
          {tasks.map((task, index) => (
            
            <TaskCard
              key={task.id}
              id={task.id}
              name={task.name}
              description={task.description}
              difficulty={task.difficulty} 
              estHours={task.estHours}
              submission={task.submission} 
              claimedBy={task.claimedBy}
              claimerUsername={task.claimerUsername}
              columnId={columnId}
              onEditTask={(updatedTask) => handleEditTask(updatedTask, index)}
            />
          ))}

        </Box>
        {title === 'Open' && (
          <AddTaskModal
            isOpen={isAddTaskModalOpen}
            onClose={handleCloseAddTaskModal}
            onAddTask={handleAddTask}
          />
        )}
      </Box>
    );
  };
  
  export default TaskColumn;
  
 
