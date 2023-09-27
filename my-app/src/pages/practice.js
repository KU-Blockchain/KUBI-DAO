import React, { use, useState } from 'react';
import nameboard from '../styles/nameboards.module.css';
import glass from '../styles/TaskColumn.module.css';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  Center
} from '@chakra-ui/react';
import { red } from '@mui/material/colors';
import { delay, wrap } from 'lodash';
import classNames from 'classnames';


const AllExecs=[  
  {
    cardname: "Tej",
    description:"Hey guys, I am Tej Gumaste and I am a sophomore studying CS and Math. I love playing video games and sometimes making them too, and I also enjoy badminton and travelling.",
    picture:"Headshot_Tej.jpg",
    id:nameboard.specialcolors,
    classid:"card"
  },
  {
    cardname:"Hudson",
    description:"Hey guys, I am Hudson Headley and I am a Senior studying CS and Econ. I am intrested in how we can use blockchain to make organizations more democratic and better for employees",
    picture:"Hudson",
    id:nameboard.specialblockchain,
    classid:"card"
  },
  {
    cardname:"Emma",
    description:"Hi! I'm Emma and I'm a senior majoring in Computer Science and minoring in visual arts. I believe blockchain has the power to make technology more just and equitable for all",
    picture:"Emma",
    id:nameboard.specialEmma,
    classid:"Emcard"
  },
  {
    cardname: "Cameron",
    description:"Hello! My name is Cameron Denton. I am an applied computer science major with a focus in economics. I love chess, rock climbing, and modern warfare 3 :)",
    picture:"Headshot_Tej.jpg",
    id:nameboard.specialCameron,
    classid:"card"
  },
  {
    cardname: "Jonathon",
    description:"Hey hey! I am a Junior studying Finance. I hope to tie my financial knowlegde with blockchain to educate others on the use-cases of fintech.",
    picture:"Headshot_Tej.jpg",
    id:nameboard.specialJonathan,
    classid:"card"
  },
  {

    cardname: "Reeny",
    description:"Hey! I'm Reeny. A current sophomore studying IC-Econ and Math. First commmit. Kinda nervous",
    picture:"Headshot_Tej.jpg",
    id:nameboard.specialJonathan,
    classid:"card"
  },
  {

    cardname: "Micah",
    description: "Hi all! I'm a junior studying computer science and minoring in math. I love the tech behind all things cyptrocurrencies, blockchain, and NFTs.",
    picture: "",
    id: nameboard.specialJonathan,
    classid: "card"
  }

]


function Fadeout(card){

  if(card.id===nameboard.specialEmma)
  {
    let allcards=document.getElementsByName("card")
    
    let classnames=[];

    AllExecs.forEach((exec)=>{
      if(exec.classid!="Emcard")
      classnames.push(exec.id)
    })

    
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
    <Center paddingTop={2}>
      <Heading justifyContent={'center'} color={'white'}>Welcome to KUBI!</Heading>
      
    </Center>
    <div style={{display:"flex", justifyContent:"center"}}>
      <div style={{
        maxWidth:"800px",
        paddingTop:"1rem"
      }}>
      <Text align={'center'} fontSize={'l'} color={'white'} fontStyle={'bold'}>
      This is a practice board developed specifically for you! Make sure you make clone the repository on to your local system and experiment away! The code is extensively documented to help you answer your questions, but if you have further questions feel free to ask any of the execs!
      </Text>
      </div>
    </div>
    
    <Flex columnGap={6} margin={4} rowGap={6} flexWrap={"wrap"}> {/*This is a flex Box, and its used  to arrange content in an orderly manner. All the cards that you all make will go into this Flex*/}
      {AllExecs.map(exec =>(  
      // This is a .map block and its used to traverse through a list and run a block of code for each element of the list. "exec" is the local variable that refers to the current element. .map is akin to for loop in Python where the "exec" is basically the "i" in a python for loop such as for i in range(5):
        <div className={exec.id} name={exec.classid} onClick={()=>{Fadeout(exec)}} style={{
          maxHeight:"500px",
          width:"400px",
          borderRadius:"10px",
          position:"relative",
          cursor:"pointer",
          padding:"1rem"
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
            {/* <---- Start working here, create a new Card open and close tag along with a cardbody open and close tag right here. Then start typing away! */}
    </Flex>
      
    </>
  );
}

export default practice;
