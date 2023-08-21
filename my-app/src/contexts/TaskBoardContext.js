import React, { createContext, useContext, useState, useEffect } from 'react';
import {  useDataBaseContext} from './DataBaseContext';

import { useToast } from '@chakra-ui/react';




const TaskBoardContext = createContext();

export const useTaskBoard = () => {
  return useContext(TaskBoardContext);
};

export const TaskBoardProvider = ({ children, initialColumns, onColumnChange, onUpdateColumns, account }) => {
  const toast=useToast();
  const [taskColumns, setTaskColumns] = useState(initialColumns);
  const { getUsernameByAddress } = useDataBaseContext();

  useEffect(() => {
    setTaskColumns(initialColumns);
  }, [initialColumns]);

  const moveTask = async(draggedTask, sourceColumnId, destColumnId, newIndex, submissionData, claimedBy) => {

    
    if (destColumnId==='inReview' && submissionData===undefined)
    {
      
      
      toast({
        title:"Invalid Submission",
        description: "Please Enter a submission",
        status: "error",
        duration: 3500,
        isClosable: true
      });

      return;
    }


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
      claimerUsername: destColumnId === 'inProgress' ? await getUsernameByAddress(claimedBy) : (destColumnId === 'open' ? '' : draggedTask.claimerUsername),
    };

    


    destColumn.tasks.splice(newIndex, 0, updatedTask);

    setTaskColumns(newTaskColumns);

    // Call the onColumnChange prop when the columns are updated
    if (onUpdateColumns) {
      onUpdateColumns(newTaskColumns);
    }
    return true;
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
