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
  ModalFooter,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';

const EditTaskModal = ({ isOpen, onClose, onEditTask, onDeleteTask, task }) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [difficulty, setDifficulty] = useState('easy');
  const [estHours, setEstimatedHours] = useState(1);

  

  const handleEditTask = () => {
    
    onEditTask({ ...task, name, description, difficulty, estHours });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
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
          <FormControl mt={4}>
            <FormLabel>Estimated Hours</FormLabel>
            <Input
              type="number"
              min="1"
              value={estHours}
              onChange={(e) => setEstimatedHours(Math.round(parseFloat(e.target.value)))}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr ="auto" onClick={() => onDeleteTask(task.id)}>
            Delete
          </Button>
          <Button colorScheme="teal" onClick={handleEditTask}>
            Save Changes
          </Button>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
