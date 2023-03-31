import Image from 'next/image'
import { useState,useEffect } from "react"
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import {Link} from 'react-scroll/modules';
import Mint from './mint'
import Overview from './overview'
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig, useAccount } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";


export default function Base () {

const account = useAccount()

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
       <div className='w-screen min-h-screen flex flex-col items-center font-Archivo'>  
         <div className='w-screen h-screen bg-bg1 bg-center bg-no-repeat filter brigtness-50'>
           <div className='flex items-center justify-between filter backdrop-blur-sm bg-black/60 h-[50px] w-full px-16'>
           <div className='font-Kanit font-bold'>Puff Logo.</div>
           <div className='flex'>
             <h1 className='text-white font-[18px] mx-5'>Home</h1>
             <h1 className='text-white font-[18px] mx-5'>Mint</h1>
             <ConnectButton />
           </div>
             
           </div>
         </div>        
       </div>
      </>
  )
}

