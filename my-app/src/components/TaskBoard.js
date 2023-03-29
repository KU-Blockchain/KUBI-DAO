import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskColumn from './TaskColumn';
import { TaskBoardProvider, useTaskBoard } from '../contexts/TaskBoardContext';

const TaskBoard = ({ columns }) => {
  return (
    <TaskBoardProvider initialColumns={columns}>
      <DndProvider backend={HTML5Backend}>
        <TaskBoardContent />
      </DndProvider>
    </TaskBoardProvider>
  );
};

const TaskBoardContent = () => {
  const { taskColumns } = useTaskBoard();

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent='space-between'
      w='100%'
      h='calc(100vh - 2rem)' // Add this line
      overflowX='hidden'
      overflowY='hidden'
      wrap={{ base: 'nowrap', md: 'nowrap' }}
    >



     
     {taskColumns.map((column, index) => (
        <Box
          key={column.id}
          flex={{ base: '1 1 100%', md: '1 1 24%' }}
          mx={2}
          my={{ base: 4, md: 0 }}
        >
          <TaskColumn
            title={column.title}
            tasks={column.tasks}
            columnId={index}
          />
        </Box>
      ))}
    </Flex>
  );
};

export default TaskBoard;
