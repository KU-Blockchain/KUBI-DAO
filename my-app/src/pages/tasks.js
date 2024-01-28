// pages/tasks.js

import React, { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import MainLayout from '../components/TaskManager/MainLayout';
import FloatingBalls from '../components/TaskManager/floatingBalls';
import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useRouter } from 'next/router';





const Tasks = () => {
  const router = useRouter();
  
  const {setTaskLoaded, setSelectedProjectId, projects} = useDataBaseContext();
  const containerRef = useRef();

  useEffect(()=>{
    


    if(router.query.projectId!==null){
      console.log("project id",router.query.projectId)
      
      setSelectedProjectId(projects,router.query.projectId)

    }
    


  },[router.query.projectId,projects]);

  useEffect(() => {
    setTaskLoaded(true);
  }, []);

  return (
    <Box p={0} minH="80vh" position="relative" bg="blackAlpha.600" ref={containerRef}>
      <FloatingBalls containerRef={containerRef} />
      <MainLayout />
    </Box>
  );
};

export default Tasks;
