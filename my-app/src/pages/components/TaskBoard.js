import { Box, Flex } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import TaskColumn from "./TaskColumn";

const TaskBoard = ({ columns }) => {
  const onDragEnd = (result) => {
    // Handle drag and drop logic here
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex direction="row" justifyContent="space-between" w="100%" overflowX="auto">
        {columns.map((column) => (
          <Box key={column.id} flex="1" mx={2}>
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
