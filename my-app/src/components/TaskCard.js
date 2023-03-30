import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';
import CardActions from './CardActions';

const TaskCard = ({ id, name, description, kubixPayout, index, columnId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id, index, columnId, name, description, kubixPayout },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const cardStyle = isDragging ? { opacity: 0.5 } : {};

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
      onClick={toggleExpanded}
    >
      <Box fontWeight="bold">{name}</Box>
      {isExpanded && (
        <>
          <Box>{description}</Box>
          <Box mt={2} fontWeight="bold">KUBIX Payout: ${kubixPayout}</Box>
          <CardActions columnId={columnId} taskId={id} />
        </>
      )}
    </Box>
  );
};

export default TaskCard;
