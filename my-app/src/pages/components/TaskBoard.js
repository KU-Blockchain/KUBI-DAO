import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskColumn from './TaskColumn';

const TaskBoard = ({ columns }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent='space-between'
        w='100%'
        overflowX='auto'
        wrap={{ base: 'nowrap', md: 'wrap' }}
      >
        {columns.map((column) => (
          <Box
            key={column.id}
            flex={{ base: '1 1 100%', md: '1 1 24%' }}
            mx={2}
            my={{ base: 4, md: 0 }}
          >
            <TaskColumn
              title={column.title}
              tasks={column.tasks}
              columnId={column.id}
              />
              </Box>
              ))}
              </Flex>
              </DndProvider>
              );
              };
              
              export default TaskBoard;
