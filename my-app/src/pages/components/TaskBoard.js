import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TaskColumn from './TaskColumn';

const TaskBoard = ({ columns }) => {
  const [taskColumns, setTaskColumns] = useState(columns);

  const moveTask = (newTasks, columnId) => {
    const newTaskColumns = [...taskColumns];
    newTaskColumns[columnId].tasks = newTasks;
    setTaskColumns(newTaskColumns);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent='space-between'
        w='100%'
        overflowX='auto'
        wrap={{ base: 'nowrap', md: 'wrap' }}
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
              columnId={index} // Use numeric index as columnId
              moveTask={moveTask}
            />
          </Box>
        ))}
      </Flex>
    </DndProvider>
  );
};

export default TaskBoard;

