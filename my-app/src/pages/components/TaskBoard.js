import { Box, Flex } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import { useState } from "react";
import TaskColumn from "./TaskColumn";

const TaskBoard = ({ columns }) => {
  const [boardColumns, setBoardColumns] = useState(columns);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const startColumn = boardColumns.find(
      (column) => column.id === source.droppableId
    );
    const endColumn = boardColumns.find(
      (column) => column.id === destination.droppableId
    );

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.tasks);
      const [removed ] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, removed);
      const newColumn = {
        ...startColumn,
        tasks: newTaskIds,
      };
    
      const newColumns = boardColumns.map((column) =>
        column.id === newColumn.id ? newColumn : column
      );
    
      setBoardColumns(newColumns);
    } else {
      const startTaskIds = Array.from(startColumn.tasks);
      const [removed] = startTaskIds.splice(source.index, 1);
    
      const endTaskIds = Array.from(endColumn.tasks);
      endTaskIds.splice(destination.index, 0, removed);
    
      const newColumns = boardColumns.map((column) => {
        if (column.id === source.droppableId) {
          return { ...column, tasks: startTaskIds };
        } else if (column.id === destination.droppableId) {
          return { ...column, tasks: endTaskIds };
        } else {
          return column;
        }
      });
    
      setBoardColumns(newColumns);
    }
  };
    return (
      <DragDropContext onDragEnd={onDragEnd}>
      <Flex
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"    
      w="100%"
      overflowX="auto"
      wrap={{ base: "nowrap", md: "wrap" }}
    >
      {boardColumns.map((column) => (
        <Box key={column.id} flex={{ base: "1 1 100%", md: "1 1 24%" }} mx={2} my={{ base: 4, md: 0 }}>
          <TaskColumn
            title={column.title}
            tasks={column.tasks}
            columnId={column.id}
          />
        </Box>
      ))}
    </Flex>
  </DragDropContext>
);

};
export default TaskBoard;  