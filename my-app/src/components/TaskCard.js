import React from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';
import TaskCardModal from './TaskCardModal';

const TaskCard = ({ id, name, description, kubixPayout, index, columnId, onEditTask, moveTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id, index, columnId, name, description, kubixPayout },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const cardStyle = isDragging ? { opacity: 0.5 } : {};

  const { isOpen, onOpen, onClose } = useDisclosure();

  const truncateDescription = (desc, maxLength) => {

    if (desc.length > maxLength) {
      console.log("check")
      return desc.substring(0, maxLength) + '...';
    }
    return desc;
  };

  return (
    <>
      <Box
        ref={drag}
        bg='white'
        borderRadius='md'
        boxShadow='sm'
        p={4}
        mb={4}
        cursor="grab"
        style={cardStyle}
        onClick={onOpen}
      >
        <Box fontWeight="bold">{name}</Box>
        <Box>{truncateDescription(description, 33)}</Box>
        {kubixPayout && (
          <Box mt={2} fontWeight="bold">KUBIX Payout: {kubixPayout}</Box>
        )}
      </Box>
      <TaskCardModal
        isOpen={isOpen}
        onClose={onClose}
        task={{ id, name, description, kubixPayout }}
        columnId={columnId}
        onEditTask={onEditTask}
        moveTask={moveTask}
      />
    </>
  );
};

export default TaskCard;
