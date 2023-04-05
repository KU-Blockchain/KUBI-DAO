import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskBoardContext = createContext();

export const useTaskBoard = () => {
  return useContext(TaskBoardContext);
};

export const TaskBoardProvider = ({ children, initialColumns, onColumnChange }) => {
  const [taskColumns, setTaskColumns] = useState(initialColumns);

  useEffect(() => {
    setTaskColumns(initialColumns);
  }, [initialColumns]);

  const moveTask = (draggedTask, sourceColumnId, destColumnId, newIndex) => {
    const newTaskColumns = [...taskColumns];

    const sourceColumn = newTaskColumns.find((column) => column.id === sourceColumnId);
    const destColumn = newTaskColumns.find((column) => column.id === destColumnId);

    const sourceTaskIndex = sourceColumn.tasks.findIndex((task) => task.id === draggedTask.id);
    sourceColumn.tasks.splice(sourceTaskIndex, 1);

    const updatedTask = {
      ...draggedTask,
      name: draggedTask.name,
      description: draggedTask.description,
      difficulty: draggedTask.difficulty,
      estHours: draggedTask.estHours,
    };

    destColumn.tasks.splice(newIndex, 0, updatedTask);

    setTaskColumns(newTaskColumns);

    // Call the onColumnChange prop when the columns are updated
    if (onColumnChange) {
      onColumnChange(newTaskColumns);
    }
  };

  //a function to add a task
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

  const deleteTask = (taskId, columnId) => {
    const newTaskColumns = [...taskColumns];
    const column = newTaskColumns.find((col) => col.id === columnId);
    const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
    column.tasks.splice(taskIndex, 1);
    setTaskColumns(newTaskColumns);
  };
  

  
  
    const value = {
      taskColumns,
      moveTask,
      addTask,
      editTask,
      setTaskColumns,
      deleteTask,
    };
  
    return (
      <TaskBoardContext.Provider value={value}>{children}</TaskBoardContext.Provider>
    );
  };
  