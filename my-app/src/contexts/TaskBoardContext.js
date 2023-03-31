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
     const taskToUpdate = sourceColumn.tasks[sourceTaskIndex];
     sourceColumn.tasks.splice(sourceTaskIndex, 1);

     // Update the task object before moving it to the destination column
     const updatedTask = {
       ...taskToUpdate,
       name: draggedTask.name,
       description: draggedTask.description,
       kubixPayout: draggedTask.kubixPayout,
     };

     // Add the updated task to the destination column at the newIndex
     destColumn.tasks.splice(newIndex, 0, updatedTask);

     setTaskColumns(newTaskColumns);
   };


   const addTask = (newTask, destColumnId) => {
    const newTaskColumns = [...taskColumns];
  
    const destColumn = newTaskColumns.find((column) => column.id === destColumnId);
  
    destColumn.tasks.push(newTask);
  
    setTaskColumns(newTaskColumns);
  };

   //a function to edit a task
   const editTask = (updatedTask, destColumnId, destTaskIndex) => {
    const newTaskColumns = [...taskColumns];
    const destColumn = newTaskColumns.find((column) => column.id === destColumnId);
    destColumn.tasks.splice(destTaskIndex, 1, updatedTask);
    setTaskColumns(newTaskColumns);
  };
  


  
  
  
    const value = {
      taskColumns,
      moveTask,
      addTask,
      editTask,
    };
  
    return (
      <TaskBoardContext.Provider value={value}>{children}</TaskBoardContext.Provider>
    );
  };
  