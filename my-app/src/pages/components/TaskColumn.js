import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks = [], columnId, moveTask, taskColumns }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item, monitor) => {
      const sourceIndex = item.index;
      const targetIndex = tasks.length;
      const sourceColumnId = item.columnId;
      const targetColumnId = columnId;

      if (sourceColumnId === targetColumnId) {
        const newTasks = [...tasks];
        const [removed] = newTasks.splice(sourceIndex, 1);
        newTasks.splice(targetIndex, 0, removed);
        moveTask(newTasks, columnId);
      } else {
        const task = {
          id: item.id,
          name: item.name,
          description: item.description,
          kubixPayout: item.kubixPayout,
          index: targetIndex
        };

        const newSourceTasks = [...tasks];
        newSourceTasks.splice(sourceIndex, 1);

        const newTargetTasks = [...taskColumns[targetColumnId].tasks];
        newTargetTasks.splice(targetIndex, 0, task);
        moveTask(newSourceTasks, sourceColumnId);
        moveTask(newTargetTasks, targetColumnId);
      }
    },

    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const columnStyle = isOver
    ? { backgroundColor: 'gray.300', minHeight: '60vh' }
    : { minHeight: '60vh' };

  return (
    <Box
      w='100%'
      px={4}
      py={6}
      bg='gray.100'
      borderRadius='md'
      boxShadow='sm'
      ref={drop}
      style={columnStyle}
    >
      <Heading size="md" mb={4}>{title}</Heading>
      {tasks.map((task, index) => (
        <TaskCard
          key={task?.id ?? index}
          id={task?.id ?? ''}
          name={task?.name ?? ''}
          description={task?.description ?? ''}
          kubixPayout={task?.kubixPayout ?? ''}
          index={index}
          columnId={columnId}
        />
      ))}
    </Box>
  );
};

export default TaskColumn;
