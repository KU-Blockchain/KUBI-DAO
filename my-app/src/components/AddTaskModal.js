import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  VStack,
  Select,
} from '@chakra-ui/react';

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [estimatedHours, setEstimatedHours] = useState(1);

  const calculateKubixPayout = (difficulty, estimatedHours) => {
    const difficulties = {
      easy: { baseKubix: 1, multiplier: 16.5 },
      medium: { baseKubix: 4, multiplier: 24 },
      hard: { baseKubix: 10, multiplier: 30 },
      veryHard: { baseKubix: 25, multiplier: 37.5 },
    };

    const { baseKubix, multiplier } = difficulties[difficulty];
    const totalKubix = Math.round(baseKubix + multiplier * estimatedHours);
    return totalKubix;
  };

  const handleSubmit = () => {
    const kubixPayout = calculateKubixPayout(difficulty, estimatedHours);
    onAddTask({ name, description, kubixPayout });
    setName('');
    setDescription('');
    setDifficulty('easy');
    setEstimatedHours(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl id="task-name">
              <FormLabel>Task Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="task-description">
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl id="task-difficulty">
              <FormLabel>Difficulty</FormLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="veryHard">Very Hard</option>
              </Select>
            </FormControl>
            <FormControl id="task-estimated-hours">
              <FormLabel>Estimated Hours</FormLabel>
              <Input
                type="number"
                min="1"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Math.round(parseFloat(e.target.value)))}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Add Task
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;

