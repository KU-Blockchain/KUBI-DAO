import React from 'react';
import { Box } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';

const TrashBin = ({ onDeleteProject }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'project',
    drop: () => ({ name: 'TrashBin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  const backgroundColor = isActive ? 'red.500' : 'gray.200';

  return (
    <Box
      ref={drop}
      bg={backgroundColor}
      w="100%"
      h="50px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {isActive ? 'Release to delete' : 'Drag a project here to delete'}
    </Box>
  );
};

export default TrashBin;
