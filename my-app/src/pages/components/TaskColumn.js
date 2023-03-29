import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { useTaskBoard } from './TaskBoardContext';

const TaskColumn = ({ title, tasks, columnId }) => {
  const { moveTask } = useTaskBoard();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => {
      if (item.columnId !== columnId) {
        const draggedTask = {
          id: item.id,
          name: item.name,
          description: item.description,
          kubixPayout: item.kubixPayout,
        };
        moveTask(draggedTask, item.columnId, columnId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const columnStyle = isOver ? { backgroundColor: 'rgba(0, 255, 0, 0.1)' } : {};

  return (
    <Box ref={drop} w="100%" px={4} py={6} bg="gray.100" borderRadius="md" boxShadow="sm" style={columnStyle}>
      <Heading size="md" mb={4}>{title}</Heading>
      <Box
        minH="60vh"
        bg="gray.200"
        borderRadius="md"
        p={4}
        style={columnStyle}
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
    </Box>
  );
};

export default TaskColumn;
c
