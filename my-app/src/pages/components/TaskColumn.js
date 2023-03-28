import { Box, Heading } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({ title, tasks, columnId }) => {
return (
<Box w="100%" px={4} py={6} bg="gray.100" borderRadius="md" boxShadow="sm">
<Heading size="md" mb={4}>{title}</Heading>
<Droppable droppableId={columnId}>
{(provided) => (
<Box
ref={provided.innerRef}
{...provided.droppableProps}
minH="60vh"
bg="gray.200"
borderRadius="md"
p={4}
>
{tasks.map((task, index) => (
<TaskCard
             key={task.id}
             id={task.id}
             name={task.name}
             description={task.description}
             kubixPayout={task.kubixPayout}
             index={index}
           />
))}
{provided.placeholder}
</Box>
)}
</Droppable>
</Box>
);
};

export default TaskColumn;
