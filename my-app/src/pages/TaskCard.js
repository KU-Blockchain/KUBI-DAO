import { Box } from "@chakra-ui/react";
import { Draggable } from "react-dnd";

const TaskCard = ({ id, name, description, kubixPayout, index }) => {
  const item = { id, index, type: "taskCard" };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          bg="white"
          borderRadius="md"
          boxShadow="sm"
          p={4}
          mb={4}
          cursor="grab"
        >
          <Box fontWeight="bold">{name}</Box>
          <Box>{description}</Box>
          <Box mt={2} fontWeight="bold">{`KUBIX Payout: ${kubixPayout}`}</Box>
        </Box>
      )}
    </Draggable>
  );
};

export default TaskCard;
