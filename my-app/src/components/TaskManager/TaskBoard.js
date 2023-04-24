import { useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TaskBoardProvider, useTaskBoard } from '../../contexts/TaskBoardContext';
import TaskColumn from './TaskColumn';

const TaskBoard = ({ columns }) => {
  const { taskColumns, setTaskColumns } = useTaskBoard();
  useEffect(() => {
    setTaskColumns(columns);
  }, [columns, setTaskColumns]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        w="100%"
        h="85vh"
        overflowX="hidden"
        overflowY="hidden"
        wrap={{ base: 'nowrap', md: 'nowrap' }}
        mt={2}
      >
        {taskColumns &&
          taskColumns.map((column) => (
              <Box
                key={column.id}
                flex={{ base: '1 1 100%', md: '1 1 24%' }}
                mx={{ base: 0, md: 2 }} // Change mx value
                my={{ base: 2, md: 0 }} // Change my value
                p={2}
                bg="rgba(0, 0, 0, 0.6)"
                borderRadius="2xl"
              >
              <TaskColumn title={column.title} tasks={column.tasks} columnId={column.id} zIndex={1}  />
            </Box>
          ))}
      </Flex>
    </DndProvider>
  );
};

export default TaskBoard;
