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
  Textarea
} from '@chakra-ui/react';

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [estHours, setEstHours] = useState(.5);


  

  const handleSubmit = () => {
    onAddTask({ name, description, difficulty,estHours });
    setDescription('');
    setName('');
    setDifficulty('easy');
    setEstHours(.5);
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
              <Textarea
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
    min="0.5"
    step="0.5"
    value={estHours}
    onBlur={(e) => {
      const val = parseFloat(e.target.value);
      if (val <= 0.5) {
        setEstHours(0.5);
      } else {
        setEstHours(Math.round(val));
      }
    }}
    onKeyDown={(e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const val = parseFloat(e.target.value);
        if (e.key === 'ArrowUp') {
          console.log(val)
          if (val === 0.5) {
            setEstHours(1);
          } else {
            setEstHours(val + 1);
          }
        } else {
          if (val === 1) {
            setEstHours(0.5);
          } else if (val > 1) {
            setEstHours(val - 1);
          }
        }
      }
    }}
    onMouseDown={(e) => {
      if (e.buttons === 1) {
        e.preventDefault();
        const input = e.target;
        const val = parseFloat(input.value);
        const direction = e.clientY < input.getBoundingClientRect().top + input.offsetHeight / 2 ? 1 : -1;
        if (direction === 1) {
          if (val === 0.5) {
            setEstHours(1);
          } else {
            setEstHours(val + 1);
          }
        } else {
          if (val === 1) {
            setEstHours(0.5);
          } else if (val > 1) {
            setEstHours(val - 1);
          }
        }
      }
    }}
    onChange={(e) => {
      const val = parseFloat(e.target.value);
      if (isNaN(val)) {
        setEstHours(0.5);
      } else {
        setEstHours(val);
      }
    }}
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

