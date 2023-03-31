import {config}  from '../dapp.config'
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

// global BigInt

const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL)
const contract = require('../artifacts/contracts/Puff.sol/Puff.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)



//  get current state functions-------------------------------------->

export const isPaused = async () => {
  const isPaused = await nftContract.methods.paused().call()
  return isPaused
}

export const isPublicMintLive = async () => {
  const isPublicMintState = await nftContract.methods.PublicMint_Live().call()
  return isPublicMintState
}

export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply().call()
  return totalMinted
}

  
  //Set up Public Mint------------------------------------------------------------------------------------>

export const PublicMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }


  const mintingAmount = Number(mintAmount)

  let MaxPublic = Number(config.MAX_MINT_PUBLIC)
  const NumberMinted = Number(await nftContract.methods.numberMinted(window.ethereum.selectedAddress).call())
  const MintableAmount = MaxPublic - NumberMinted
  console.log('Minatble Amount ',MintableAmount)
  
  const ExceededMaxMint = MintableAmount < mintingAmount
  console.log('ExceededMaxMint',ExceededMaxMint)
    if (ExceededMaxMint) {
      return {
        success: false,
        status: 'Exceeded Max Mint Amount'
      }
}

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )
  
  const mintingCost = ((config.PublicMintCost*mintingAmount).toFixed(18))

  // Set up our Ethereum transaction

  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(mintingCost), 'ether')
    ).toString(16), // hex
    gas: String(25000 * mintAmount),
    data: nftContract.methods
      .PublicMint(mintingAmount)
      .encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://goerli.etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan ✅</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Ooops!:' + error.message
    }
  }
}
