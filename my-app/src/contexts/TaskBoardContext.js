import React, { createContext, useContext, useState } from 'react';

const TaskBoardContext = createContext();

export const useTaskBoard = () => {
  return useContext(TaskBoardContext);
};

export const TaskBoardProvider = ({ children, initialColumns }) => {
  const [taskColumns, setTaskColumns] = useState(initialColumns);

  const moveTask = (draggedTask, sourceColumnId, destColumnId, newIndex) => {
    const newTaskColumns = [...taskColumns];
  
    const sourceColumn = newTaskColumns.find((column) => column.id === sourceColumnId);
    const destColumn = newTaskColumns.find((column) => column.id === destColumnId);
  
    // Find and remove the dragged task from the source column
    const sourceTaskIndex = sourceColumn.tasks.findIndex((task) => task.id === draggedTask.id);
    sourceColumn.tasks.splice(sourceTaskIndex, 1);
  
    // Add the dragged task to the destination column at the newIndex
    destColumn.tasks.splice(newIndex, 0, draggedTask);
  
    setTaskColumns(newTaskColumns);
  };

  const addTask = (newTask, destColumnId) => {
    const newTaskColumns = [...taskColumns];
  
    const destColumn = newTaskColumns.find((column) => column.id === destColumnId);
  
    destColumn.tasks.push(newTask);
  
    setTaskColumns(newTaskColumns);
  };
  
  
  
  
  
  
    const value = {
      taskColumns,
      moveTask,
      addTask,
    };
  
    return (
      <TaskBoardContext.Provider value={value}>{children}</TaskBoardContext.Provider>
    );
  };
  