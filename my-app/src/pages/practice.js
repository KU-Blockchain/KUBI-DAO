import React, { use, useState } from 'react';
import nameboard from '../styles/nameboards.module.css';
import glass from '../styles/TaskColumn.module.css';
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
import { delay, wrap } from 'lodash';
import classNames from 'classnames';


const AllExecs=[
  {
    cardname: "Tej",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Headshot_Tej.jpg",
    id:nameboard.specialcolors,
    classid:"card"
  },
  {
    cardname:"Hudson",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Hudson",
    id:nameboard.specialblockchain,
    classid:"card"
  },
  {
    cardname:"Emma",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Emma",
    id:nameboard.specialEmma,
    classid:"Emcard"
  },
  {
    cardname: "Cameron",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Headshot_Tej.jpg",
    id:nameboard.specialCameron,
    classid:"card"
  },
  {
    cardname: "Jonathan",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and bad bitches.",
    picture:"Headshot_Tej.jpg",
    id:nameboard.specialJonathan,
    classid:"card"
  },
]


function cardClasses(card){

  if(card.id===nameboard.specialEmma)
  {
    let allcards=document.getElementsByName("card")
    
    let classnames=[];

    AllExecs.forEach((exec)=>{
      if(exec.classid!="Emcard")
      classnames.push(exec.id)
    })

    console.log(classnames)
    
    allcards.forEach((card)=>{
      card.className=""
      card.classList.add(nameboard.fadeaway)
      console.log(card.id)
    })

    setTimeout(()=>{
      for(let i =0;i< allcards.length;i++)
      {
        allcards[i].className=""
        allcards[i].classList.add(classnames[i])
      }
    },5500)

    
  }


}


function practice()
{

  
  return(
    <>
    
    <Flex columnGap={6} margin={4} rowGap={6} flexWrap={"wrap"}>
      {AllExecs.map(exec =>(
      
        <div className={exec.id} name={exec.classid} onClick={()=>{cardClasses(exec)}} style={{
          maxHeight:"500px",
          width:"400px",
          borderRadius:"10px",
          position:"relative"
        }}>
        <div className={glass} style={{
          position:"absolute",
          width:"100%",
          height:"100%",
          }}></div>
        <div style={{display:"flex", flexDirection:"column"}}>
          <div style={{display:"flex"}}>
            <div style={{
              marginRight: "2rem",
              paddingLeft:"1.5rem",
              paddingTop:"1.5rem",
              height: "100%",
              display:"flex",
              flexDirection:"column",
              alignItems:"center"
            }}>
              <div style={{border:"solid",borderWidth:"3px", borderRadius:"50%"}}>
                <Avatar name={exec.cardname} src={exec.picture}/>
              </div>
              {exec.cardname}
              
            </div>
            <div style={{
              display:"flex"
              
            }}>
              <div style={{
                paddingRight:"1rem"
              }}>
                {exec.description}
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
      ))}
      <Card>
        <CardBody>
          hi its Tej
        </CardBody>
      </Card>
    </Flex>
      
    </>
  );
}

export default practice;
