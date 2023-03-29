import React, { createContext, useContext, useState } from 'react';

const TaskBoardContext = createContext();

export const useTaskBoard = () => {
  return useContext(TaskBoardContext);
};

export const TaskBoardProvider = ({ children, initialColumns }) => {
  const [taskColumns, setTaskColumns] = useState(initialColumns);

  const moveTask = (draggedTask, sourceColumnId, destColumnId) => {
    const newTaskColumns = [...taskColumns];

    newTaskColumns[sourceColumnId].tasks = newTaskColumns[sourceColumnId].tasks.filter(
      (task) => task.id !== draggedTask.id
    );

    newTaskColumns[destColumnId].tasks = [
        ...newTaskColumns[destColumnId].tasks,
        draggedTask,
      ];
  
      setTaskColumns(newTaskColumns);
    };
  
    const value = {
      taskColumns,
      moveTask,
    };
  
    return (
      <TaskBoardContext.Provider value={value}>{children}</TaskBoardContext.Provider>
    );
  };
  