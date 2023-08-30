import React, { use, useState } from 'react';
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
  Textarea,
  useToast,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Flex,
  Avatar
} from '@chakra-ui/react';
import { red } from '@mui/material/colors';


const AllExecs=[
  {
    cardname: "Tej Gumaste",
    description:"Hi I am Tej from CS",
    picture:"Headshot_Tej.jpg"
  },
  {
    cardname:"Hudson",
    description:"i love DAOs",
    picture:"Hudson"
  },
  {
    cardname:"Emma",
    description:"i love CS",
    picture:"Emma"
  }
]

function practice()
{
  return(
    <>
    
    <Flex columnGap={3}>
      {AllExecs.map(exec =>(
        <Card maxHeight={500} maxWidth={500}>
        <CardBody style={{display:"flex", flexDirection:"column"}}>
          <div style={{textAlign:'center'}}>Exec Member</div>
          <div style={{display:"flex"}}>
            <div style={{
              marginRight: "2rem",
              height: "100%",
              display:"flex",
              flexDirection:"column",
              alignItems:"center"
            }}>
              <div>
                <Avatar name={exec.cardname} src={exec.picture}/>
              </div>
              {exec.cardname}
              
            </div>
            <div style={{
              display:"flex"
              
            }}>
              <div>
                {exec.description}
              </div>
              
            </div>
          </div>
          
        </CardBody>
      </Card>
      ))}
      
        <Card>
          <CardBody>
            Test Text
          </CardBody>
        </Card>
    </Flex>
      
    </>
  );
}

export default practice;
