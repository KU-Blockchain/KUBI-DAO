import React, { use, useState } from 'react';
import '../styles/nameboards.module.css';
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
import { wrap } from 'lodash';
import classNames from 'classnames';


const AllExecs=[
  {
    cardname: "Tej",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Headshot_Tej.jpg",
    id:1
  },
  {
    cardname:"Hudson",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Hudson",
    id:"colors"
  },
  {
    cardname:"Emma",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Emma",
    id:"colors"
  },
  {
    cardname: "Cameron",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Headshot_Tej.jpg",
    id:"colors"
  },
  {
    cardname: "Jonathan",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Headshot_Tej.jpg",
    id:"colors"
  },
]


function cardClasses(idnum){
  console.log(idnum)
  switch(idnum){
    case 1: return "specialcolors"
  }
}


function practice()
{
  return(
    <>
    
    <Flex columnGap={6} margin={4} rowGap={6} flexWrap={"wrap"}>
      {AllExecs.map(exec =>(
      
        <Card maxHeight={500} width={400} borderRadius={50} bgColor={"teal.200"} className="specialcolors">
        <CardBody style={{display:"flex", flexDirection:"column"}}>
          <div style={{display:"flex"}}>
            <div style={{
              marginRight: "2rem",
              height: "100%",
              display:"flex",
              flexDirection:"column",
              alignItems:"center"
            }}>
              <div style={{border:"solid",borderWidth:"3px", borderRadius:"50%"}}>
                <Avatar name={exec.cardname} src={exec.picture}/>
              </div>
              {exec.name}
              
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
      
    </Flex>
      
    </>
  );
}

export default practice;
