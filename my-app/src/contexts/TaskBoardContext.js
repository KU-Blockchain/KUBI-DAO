import React, { createContext, useContext, useState } from 'react';

const TaskBoardContext = createContext();

export const useTaskBoard = () => {
  return useContext(TaskBoardContext);
};

export const TaskBoardProvider = ({ children, initialColumns }) => {
  const [taskColumns, setTaskColumns] = useState(initialColumns);

  const moveTask = (draggedTask, sourceColumnId, destColumnId) => {
    const newTaskColumns = [...taskColumns];
  
    const sourceColumn = newTaskColumns.find((column) => column.id === sourceColumnId);
    const destColumn = newTaskColumns.find((column) => column.id === destColumnId);
  
    sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== draggedTask.id);
    destColumn.tasks = [...destColumn.tasks, draggedTask];
  
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
  