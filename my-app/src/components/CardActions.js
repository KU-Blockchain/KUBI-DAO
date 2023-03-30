import React, { useState } from 'react';
import { Box, Button, Input } from '@chakra-ui/react';
import { CheckIcon, EditIcon } from '@chakra-ui/icons';
import { useTaskBoard } from '../contexts/TaskBoardContext';

const CardActions = ({ columnId, taskId }) => {
  const { updateTask } = useTaskBoard();
  const [submission, setSubmission] = useState('');

  const handleButtonClick = () => {
    if (columnId === 'open') {
      updateTask(columnId, taskId, { status: 'inProgress' });
    } else if (columnId === 'inProgress') {
      updateTask(columnId, taskId, { status: 'inReview', submission });
    } else if (columnId === 'inReview') {
      updateTask(columnId, taskId, { status: 'completed' });
    }
  };

  const buttonText = () => {
    if (columnId === 'open') return 'Claim';
    if (columnId === 'inProgress') return 'Submit';
    if (columnId === 'inReview') return 'Complete Review';
    return '';
  };

  return (
    <Box mt={4}>
      {columnId === 'completed' ? (
        <CheckIcon color="green.500" />
      ) : (
        <>
          {columnId === 'inProgress' && (
            <Input
            placeholder="Type your submission here"
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            mb={2}
            />
            )}
            <Button onClick={handleButtonClick} colorScheme="teal" mr={2}>
            {buttonText()}
            </Button>
            {columnId === 'open' && (
            <Button leftIcon={<EditIcon />} variant="outline">
            Edit
            </Button>
            )}
            </>
            )}
            </Box>
            );
            };
            
            export default CardActions;
