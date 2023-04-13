import React from 'react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';
import TaskCardModal from './TaskCardModal';

const TaskCard = ({ id, name, description, difficulty, estHours, index, columnId, submission,claimedBy,claimerUsername, onEditTask, moveTask, }) => {
  const calculateKubixPayout = (difficulty, estimatedHours) => {
    
    const difficulties = {
      easy: { baseKubix: 1, multiplier: 16.5 },
      medium: { baseKubix: 4, multiplier: 24 },
      hard: { baseKubix: 10, multiplier: 30 },
      veryHard: { baseKubix: 25, multiplier: 37.5 },
    };
    
    const { baseKubix, multiplier } = difficulties[difficulty];
    const totalKubix = Math.round(baseKubix + (multiplier * estimatedHours));
    return totalKubix;
  };

  const kubixPayout = calculateKubixPayout(difficulty, estHours);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id, index, columnId, name, description,difficulty, estHours, claimedBy, claimerUsername},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const cardStyle = isDragging ? { opacity: 0.5 } : {};

  const { isOpen, onOpen, onClose } = useDisclosure();

  const truncateDescription = (desc, maxLength) => {

    if (desc.length > maxLength) {
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
        p={2}
        mb={4}
        cursor="grab"
        style={cardStyle}
        onClick={onOpen}
      >
        <Box fontWeight="600">{name}</Box>
        <Box fontSize="xs">{truncateDescription(description, 40)}</Box>
        {kubixPayout && (
          <Box mt={2} fontWeight="500">KUBIX Payout: {kubixPayout}</Box>
        )}
      </Box>
      <TaskCardModal
        isOpen={isOpen}
        onClose={onClose}
        task={{ id, name, description, difficulty, estHours,kubixPayout, submission, claimedBy,claimerUsername}}
        columnId={columnId}
        onEditTask={onEditTask}
        moveTask={moveTask}
      />
    </>
  );
};

export default TaskCard;
