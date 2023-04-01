import Image from 'next/image'
import { useState,useEffect } from "react"
import {Link} from 'react-scroll/modules';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig, useAccount } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import {
  PublicMint,
  WhitelistedMint,
  ClaimSpecialNFT,
  getTotalMinted,
  getNumberMinted,
  isPaused,
  isPublicMintLive,
  isWhitelistMinLive
} from '../ulits/interact';
import {config} from '../dapp.config'

export default function Mint () {

const account = useAccount()

const [isPausedState , setIsPauseState] = useState (false);
const [isPublicState, setIsPublicStat] = useState (false);
const [isWlState, setIsWlState] = useState(false)

const [totalMinted , setTotalMinted] = useState (0);
const [numberMinted, setNumberMinted] = useState(0);

const [status, setStatus] = useState('')
const [success, setSuccess] = useState(false)

const [mintAmount, setMintAmount] = useState(1)
const [isMinting, setIsMinting] = useState(false)
const [cost , setCost] = useState(0)
const [maxMintAmount, setMaxMintAmount] = useState(0)

useEffect(() => {
  const init = async () => {
    setTotalMinted(await getTotalMinted())
    setNumberMinted(await getNumberMinted())

    setIsPauseState(await isPaused())
    setIsPublicStat(await isPublicMintLive())
    setIsWlState(await isWhitelistMinLive())
    
    
  }

  init()
}, []);

useEffect(() => {
  const init = async () => {

setMaxMintAmount(numberMinted == config.MAX_MINT_PUBLIC ? 1 : config.isWlState ? config.MAX_MINT_WHITELIST : config.MAX_MINT_PUBLIC)    
  }

  init()
});


const publicMintHandler = async () => {
  setIsMinting(true)

  const { success, status } = await PublicMint(mintAmount)

  setStatus(status)
  setSuccess(success)
  
  setIsMinting(false)
}

const whitelistMintHandler = async () => {
  setIsMinting(true)

  const { success, status } = await WhitelistedMint(mintAmount)

  setStatus(status)
  setSuccess(success)
  
  setIsMinting(false)
}

const claimSpecialNftHandler = async () => {
  setIsMinting(true)

  const { success, status } = await ClaimSpecialNFT(mintAmount)

  setStatus(status)
  setSuccess(success)
  
  setIsMinting(false)
}


const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }
  
    let availableFreemintAmount = 0
    if (numberMinted < config.MaxperWallet_Free) {
  	availableFreemintAmount = (config.MaxperWallet_Free - numberMinted)
    }
    
   let mintingCost = 0 ;
    
    if (numberMinted < config.MAX_MINT_PUBLIC && numberMinted + mintAmount > config.MaxperWallet_Free ) {
      mintingCost = (config.PublicMintCost* (mintAmount - availableFreemintAmount))
  }


  
  return (
  <>
   <div className='font-Archivo backdrop-filter backdrop-blur-md border-2 border-gray-100 rounded-lg'>
   
    <div className='w-auto h-auto px-6 py-4 flex flex-col justify-center items-center relative '>
    
        <h1 className='font-Kanit font-bold text-3xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>Baggies.</h1>
           
    	  <h1 className='text-black text-2xl font-bold text-center'>{isPausedState ? 'Will be Live soon!' : numberMinted == config.MAX_MINT_PUBLIC ? 'Claim your Special NFT' : isWlState? 'Whitelisted Mint': isPublicState? 'Public Mint is Live!' : 'Will be Live soon!'}</h1>
    	  
    	      <div className='mt-4'><ConnectButton /></div>             
    	  
    	  <div className='w-auto flex justify-center items-center relative mt-6'>
                <div className="z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-2 py-2 bg-black border rounded-md flex items-center justify-center text-white font-semibold">
                  <p className='text-sm'>
                    {totalMinted} / 5000                    
                  </p>
                </div>

                <img
		  alt="image"
                  src="https://media.marketrealist.com/brand-img/OtC_tLFJZ/1600x838/nft-black-1617959604349.jpg"
                  className="object-cover md:h-[240px] h-[200px] md:w-[240px] w-[200px] rounded-md border border-gray-100"
                />
    	  </div>
    	  
    	  <div className='w-full flex justify-between border rounded-md py-3 px-5 mt-5 filter drop-shadow-lg'>
    	  <p>Total</p>
    	    <div className="flex items-center space-x-3">
    	    <p>
    	     {Number.parseFloat(mintingCost).toFixed(
                          4
                        )}{' '} ETH
    	    </p>
    	    <p>+ GAS</p>
    	    </div>
    	  </div>
    	  
    	  <div className='w-full h-full flex rounded-md border mt-2 filter drop-shadow-lg'>    	  
    	    <div className='px-5 py-3 border-r cursor-pointer' onClick={decrementMintAmount}>
    	      <svg className='hover:scale-110' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill='#000'><path d="M5 11h14v2H5z"></path></svg>
    	    </div>
    	    
    	    <div className='py-3 md:px-20 px-6 border-r'><h1 className='text-lg'> {mintAmount} </h1></div>
    	    
    	    <div className='px-5  py-3 border-r cursor-pointer' onClick={incrementMintAmount}>
    	       <svg className='hover:scale-110' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill='#000'><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
    	    </div>
    	    
    	    {account.isConnected?
    	   ( <button className='px-10 py-3 bg-black text-white font-semibold hover:text-bold hover:scale-110'
    	   onClick={numberMinted == config.MAX_MINT_PUBLIC? claimSpecialNftHandler : isPublicState? publicMintHandler : whitelistMintHandler}> Mint</button> 
    	   ) :(<button className='px-10 py-3 bg-gray-700/60 text-white font-semibold cursor-not-allowed '> Mint</button> )
    	    }
    	  </div>
    	  
    	  <div className='flex items-center mt-4'>
             <a className='mx-4' target='_blank' rel="noreferrer" href='https://www.instagram.com/'><svg xmlns="http://www.w3.org/2000/svg"  className="w-8 h-8" viewBox="0 0 24 24" ><path fill="#000" d="M20.947 8.305a6.53 6.53 0 0 0-.419-2.216 4.61 4.61 0 0 0-2.633-2.633 6.606 6.606 0 0 0-2.186-.42c-.962-.043-1.267-.055-3.709-.055s-2.755 0-3.71.055a6.606 6.606 0 0 0-2.185.42 4.607 4.607 0 0 0-2.633 2.633 6.554 6.554 0 0 0-.419 2.185c-.043.963-.056 1.268-.056 3.71s0 2.754.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.043 1.268.056 3.71.056s2.755 0 3.71-.056a6.59 6.59 0 0 0 2.186-.419 4.615 4.615 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.187.043-.962.056-1.267.056-3.71-.002-2.442-.002-2.752-.058-3.709zm-8.953 8.297c-2.554 0-4.623-2.069-4.623-4.623s2.069-4.623 4.623-4.623a4.623 4.623 0 0 1 0 9.246zm4.807-8.339a1.077 1.077 0 0 1-1.078-1.078 1.077 1.077 0 1 1 2.155 0c0 .596-.482 1.078-1.077 1.078z"></path><circle cx="11.994" cy="11.979" r="3.003" fill="#000"></circle></svg></a>
    <a target='_blank' rel="noreferrer" href='https://discord.gg/'><svg xmlns="http://www.w3.org/2000/svg"  className="w-8 h-8" viewBox="0 0 24 24" ><path fill="#000" d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path></svg></a>
    <a className='mx-4' target='_blank' rel="noreferrer" href='https://twitter.com/'><svg xmlns="http://www.w3.org/2000/svg"  className="w-8 h-8" viewBox="0 0 24 24" ><path fill="#000" d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"></path></svg></a>
           </div>
    	  
    	  {status && success ?
    	  (<div className='text-sm p-4 border boder-green-500 rounded-md mt-4'>{status}</div>) :
    	  status && !success ?
    	  (<div className='text-sm p-4 border boder-red-500 rounded-md mt-4'>{status}</div>):
    	  (<></>)
    	  }
    	  
    	</div>
    
    
   </div>
  </>
  )
}



