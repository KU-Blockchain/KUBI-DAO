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
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

const EditTaskModal = ({ isOpen, onClose, onEditTask, onDeleteTask, task }) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [kubixPayout, setKubixPayout] = useState(task.kubixPayout);

  const handleEditTask = () => {
    onEditTask({ ...task, name, description, kubixPayout });
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
            <FormLabel>KUBIX Payout</FormLabel>
            <NumberInput value={kubixPayout} onChange={(value) => setKubixPayout(value)}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleEditTask}>
            Save Changes
          </Button>
          <Button colorScheme="red" mr={3} onClick={() => onDeleteTask(task.id)}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
