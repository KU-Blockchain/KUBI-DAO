import React from 'react';
import { Button } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';

const DraggableProject = ({ project, isSelected, onSelectProject, onDeleteProject }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'project',
    item: { id: project.id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDeleteProject(item.id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;
  return (
    <Button
      ref={drag}
      onClick={() => onSelectProject(project.id)}
      width="100%"
      bg={isSelected ? 'gray.300' : undefined}
      style={{ opacity }}
    >
      {project.name}
    </Button>
  );
};

export default DraggableProject;
