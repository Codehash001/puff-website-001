import Image from 'next/image'
import { useState,useEffect } from "react"
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import {Link} from 'react-scroll/modules';
import Mint from './mint'
import Overview from './overview'


export default function Base () {


const[nav, setNav] = useState(false)

const handleNav = () => {
  setNav(!nav);
}

const [toggleState, setToggleState] = useState(1);

   const toggleTab = (index) =>{
    setToggleState (index);
    setNav(false);
   }



  
  return (
      <>
       <div className='w-screen min-h-screen flex flex-col items-center'>  
         <div className='w-screen h-screen bg-bg1 bg-center bg-no-repeat'>
           <h1>PUFF</h1>
         </div>        
       </div>
      </>
  )
}

