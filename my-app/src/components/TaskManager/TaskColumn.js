import React, { useState, useEffect, useRef } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton} from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { useTaskBoard } from '../../contexts/TaskBoardContext';
import AddTaskModal from './AddTaskModal';
import { useWeb3Context } from '../../contexts/Web3Context';
import { useDataBaseContext } from '../../contexts/DataBaseContext';
// ... other imports
import '../../styles/TaskColumn.module.css';

// ... inside TaskColumn component, before return statement
const glassLayerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: -1,
  borderRadius: 'inherit',
  backdropFilter: 'blur(60px)',
  backgroundColor: 'rgba(0, 0, 0, .3)',
};







const TaskColumn = ({ title, tasks, columnId }) => {
  const { moveTask, addTask, editTask } = useTaskBoard();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const { hasExecNFT,hasMemberNFT,account, mintKUBIX } = useWeb3Context();
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
        else if (title === 'Completed') {
          console.log("item.claimedBy: ", item.claimedBy)
          console.log("item.kubixPayout: ", item.kubixPayout)
          setTimeout(async() => {await mintKUBIX(item.claimedBy, item.kubixPayout, true)}, 2100);

        }

        if (item.columnId === 'completed') {
          alert('You cannot move tasks from the Completed column.');
          return;
        }


  
        if (item.columnId !== columnId) {
          console.log("maybe this one")
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
      <Box
      ref={drop}
      w="100%"
      h="100%"
      bg="transparent" // Set the background to transparent
      borderRadius="md"
      boxShadow="lg"
      style={{ ...columnStyle, position: 'relative' }} // Add position: 'relative'
      zIndex={1}
    >
      <div className="glass" style={glassLayerStyle} />
        <Heading size="md" mb={3} mt={0}ml={3}alignItems="center" color='white'>
          {title}
          {title === 'Open' && (
            <IconButton
              ml={8}
              icon={<AddIcon color="white" />} // Change color to white
              aria-label="Add task"
              onClick={handleOpenAddTaskModal}
              h="1.60rem" // Adjust height
              w="1.60rem" // Adjust width
              minW={0} // Set minimum width to 0
              bg="" // Set background color to black
              border= ".5px solid white"
              boxshadow="md"
            />

          )}
        </Heading>
        <Box
            h="calc(100% - 3rem)"
            borderRadius="md"
            bg="transparent"
            p={2} // Change p value
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
                kubixPayout={task.kubixPayout}
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
  
 
