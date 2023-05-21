import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

const Countdown = ({ duration }) => {
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  return (
    <div style={{ position:"relative" }}>
      <Text fontWeight="bold" fontSize="xl">
        {`${hours}h ${minutes}m ${seconds}s`}
      </Text>
    </div>
  );
};

export default Countdown;
