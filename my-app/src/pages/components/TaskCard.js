import React from 'react';
import { Box } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';

const TaskCard = ({ id, name, description, kubixPayout, index, columnId }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id, index, columnId, name, description, kubixPayout },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const cardStyle = isDragging ? { opacity: 0.5 } : {};

  if (!id) {
    console.log('TaskCard: id is undefined', { id, name, description, kubixPayout, index, columnId });
  }

  if (!name) {
    console.log('TaskCard: name is undefined', { id, name, description, kubixPayout, index, columnId });
  }

  if (!description) {
    console.log('TaskCard: description is undefined', { id, name, description, kubixPayout, index, columnId });
  }

  if (!kubixPayout) {
    console.log('TaskCard: kubixPayout is undefined', { id, name, description, kubixPayout, index, columnId });
  }

  return (
    <Box
      ref={drag}
      bg='white'
      borderRadius='md'
      boxShadow='sm'
      p={4}
      mb={4}
      cursor="grab"
      style={cardStyle}
    >
      <Box fontWeight="bold">{name}</Box>
      <Box>{description}</Box>
      {kubixPayout && (
        <Box mt={2} fontWeight="bold">KUBIX Payout: ${kubixPayout}</Box>
      )}
    </Box>
  );
};

export default TaskCard;
