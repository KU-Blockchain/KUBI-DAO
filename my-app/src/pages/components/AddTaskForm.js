import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea } from '@chakra-ui/react';

const AddTaskForm = ({ isOpen, onClose, onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPayout, setTaskPayout] = useState('');

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleTaskPayoutChange = (event) => {
    setTaskPayout(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTask({ name: taskName, description: taskDescription, kubixPayout: taskPayout });
    setTaskName('');
    setTaskDescription('');
    setTaskPayout('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new task</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Task name</FormLabel>
              <Input value={taskName} onChange={handleTaskNameChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Task description</FormLabel>
              <Textarea value={taskDescription} onChange={handleTaskDescriptionChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>KUBIX payout</FormLabel>
              <Input type="number" value={taskPayout} onChange={handleTaskPayoutChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Add task
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskForm;
