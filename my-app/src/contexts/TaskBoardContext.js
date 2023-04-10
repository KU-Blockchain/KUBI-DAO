import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3Context } from './Web3Context';


const TaskBoardContext = createContext();

export const useTaskBoard = () => {
  return useContext(TaskBoardContext);
};

export const TaskBoardProvider = ({ children, initialColumns, onColumnChange, onUpdateColumns, account }) => {
  const [taskColumns, setTaskColumns] = useState(initialColumns);

  useEffect(() => {
    setTaskColumns(initialColumns);
  }, [initialColumns]);

  const moveTask = (draggedTask, sourceColumnId, destColumnId, newIndex, submissionData, claimedBy) => {
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
      submission: destColumnId === 'inReview' ? submissionData : draggedTask.submission,
      claimedBy: destColumnId === 'inProgress' ? claimedBy : (destColumnId === 'open' ? '' : draggedTask.claimedBy),
    };

    destColumn.tasks.splice(newIndex, 0, updatedTask);

    setTaskColumns(newTaskColumns);

    // Call the onColumnChange prop when the columns are updated
    if (onColumnChange) {
      onColumnChange(newTaskColumns);
    }
  };

  const addTask = async (newTask, destColumnId) => {
    const newTaskColumns = [...taskColumns];

    const destColumn = newTaskColumns.find((column) => column.id === destColumnId);

    destColumn.tasks.push(newTask);

    setTaskColumns(newTaskColumns);

    // Call the onUpdateColumns prop when the columns are updated
    if (onUpdateColumns) {
      await onUpdateColumns(newTaskColumns);
    }
  };

  //a function to edit a task
  const editTask = async(updatedTask, destColumnId, destTaskIndex) => {
    const newTaskColumns = [...taskColumns];
    const destColumn = newTaskColumns.find((column) => column.id === destColumnId);
    destColumn.tasks.splice(destTaskIndex, 1, updatedTask);
    setTaskColumns(newTaskColumns);

    if (onUpdateColumns) {
      await onUpdateColumns(newTaskColumns);
    }
  };

  const deleteTask = async(taskId, columnId) => {
    const newTaskColumns = [...taskColumns];
    const column = newTaskColumns.find((col) => col.id === columnId);
    const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
    column.tasks.splice(taskIndex, 1);
    setTaskColumns(newTaskColumns);
    if (onUpdateColumns) {
      await onUpdateColumns(newTaskColumns);
    }
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
