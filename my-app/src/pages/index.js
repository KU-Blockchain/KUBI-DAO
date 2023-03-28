import { Box } from "@chakra-ui/react";
import TaskBoard from "./components/TaskBoard";

const columns = [
  {
    id: "open",
    title: "Open",
    tasks: [
      { id: "1", name: "Task 1", description: "This is task 1", kubixPayout: 100 },
      { id: "2", name: "Task 2", description: "This is task 2", kubixPayout: 200 },
      ],
      },
      {
      id: "inProgress",
      title: "In Progress",
      tasks: [
      { id: "3", name: "Task 3", description: "This is task 3", kubixPayout: 150 },
      ],
      },
      {
      id: "inReview",
      title: "In Review",
      tasks: [
      { id: "4", name: "Task 4", description: "This is task 4", kubixPayout: 300 },
      ],
      },
      {
      id: "completed",
      title: "Completed",
      tasks: [
      { id: "5", name: "Task 5", description: "This is task 5", kubixPayout: 250 },
    ],
    },
    ];
    
    export default function Home() {
    return (
    <Box p={8} minH="100vh" bg="gray.50">
    <TaskBoard columns={columns} />
    </Box>
    );
    }
    
    