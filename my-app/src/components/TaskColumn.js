import { AddIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, useDisclosure } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { useTaskBoard } from '../contexts/TaskBoardContext';
import AddTaskModal from './AddTaskModal';
import React, { useState } from 'react';


const TaskColumn = ({ title, tasks, columnId }) => {
  const { moveTask, addTask } = useTaskBoard();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleOpenAddTaskModal = () => {
    if (title === 'Open') {
      setIsAddTaskModalOpen(true);
    }
  };

  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const handleAddTask = (newTask) => {
    if (title === 'Open') {
      const updatedTask = { ...newTask, id: `task-${Date.now()}` };
      const newIndex = tasks.length;//
      addTask(updatedTask, columnId, columnId, newIndex);
    }
  };
  

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => {
      if (item.columnId !== columnId) {
        const newIndex = tasks.length; // Use the length of the destination column's tasks as the newIndex
        const draggedTask = {
          id: item.id,
          name: item.name,
          description: item.description,
          kubixPayout: item.kubixPayout,
        };
        moveTask(draggedTask, item.columnId, columnId, newIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const columnStyle = isOver ? { backgroundColor: 'rgba(0, 255, 0, 0.1)' } : {};

  return (
    <Box ref={drop} w="100%" h="100%" px={4} py={6} bg="gray.100" borderRadius="md" boxShadow="sm" style={columnStyle}>

      <Heading size="md" mb={4} alignItems="center">
        {title}
        {title === 'Open' && (
          <IconButton
            ml={2}
            icon={<AddIcon />}
            aria-label="Add task"
            onClick={handleOpenAddTaskModal}
            h="1rem" // set the height of the IconButton
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
                kubixPayout={task.kubixPayout}
                index={index}
                columnId={columnId}
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

