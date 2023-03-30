import { createContext, useContext, useState } from 'react';

const TaskBoardContext = createContext();

export const useTaskBoard = () => useContext(TaskBoardContext);

export const TaskBoardProvider = ({ children, initialColumns }) => {
  const [taskColumns, setTaskColumns] = useState(initialColumns);

  const updateTask = (columnId, taskId, updates) => {
    const updatedColumns = taskColumns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        };
      }
      return column;
    });

    setTaskColumns(updatedColumns);
  };

  const value = {
    taskColumns,
    updateTask,
  };

  return (
    <TaskBoardContext.Provider value={value}>
      {children}
    </TaskBoardContext.Provider>
  );
};
  