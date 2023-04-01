import {config}  from '../dapp.config'
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

// global BigInt

const web3 = createAlchemyWeb3('https://eth-goerli.g.alchemy.com/v2/bYwv6lWEDB1KoLyivwgn_7YhZNSOkCRy')
const contract = require('../artifacts/contracts/Baggies.sol/Baggies.json')
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

export const isWhitelistMinLive = async () => {
  const isWhitelistMintState = await nftContract.methods.WhitelistMint_Live().call()
  return isWhitelistMintState
}

export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply().call()
  return totalMinted
}

export const getNumberMinted = async () => {
  const numberMinted = await nftContract.methods.numberMinted(window.ethereum.selectedAddress).call()
  return numberMinted
}

export const getClaimDate = async () => {
  const claimDate = await nftContract.methods.walletSpecialNFTClaimDate(window.ethereum.selectedAddress).call()
  return claimDate
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
  let availableFreemintAmount = 0
    if (NumberMinted < config.MaxperWallet_Free) {
  	availableFreemintAmount = (config.MaxperWallet_Free - NumberMinted)
    }
    
   let mintingCost = 0 ;
    if (NumberMinted + mintingAmount > config.MaxperWallet_Free ) {
      mintingCost = ((config.PublicMintCost* (mintingAmount - availableFreemintAmount)).toFixed(18))
  }

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
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
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

//Set up Whitelist Mint------------------------------------------------------------------------------------>

export const WhitelistedMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }
  // Calculate merkle root from the whitelist array
  const leafNodes = whitelist.map((addr) => keccak256(addr))
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
  const root = merkleTree.getRoot()

  const leaf = keccak256(window.ethereum.selectedAddress)
  const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
  const isValid = merkleTree.verify(proof, leaf, root)

  if (!isValid) { 
    return {
      success: false,
      status: '❌ Invalid Merkle Proof - You are not whitelisted'
    }
  }
  
  const mintingAmount = Number(mintAmount)


  let MaxWhitelist = Number(config.MAX_MINT_WHITELIST)
  let numberMinted = Number(await nftContract.methods.numberMinted(window.ethereum.selectedAddress).call())
  let MintableAmount = Number(MaxWhitelist - numberMinted)
  
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
 

  // Set up our Ethereum transaction

  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    gas: String(25000 * mintAmount),
    data: nftContract.methods
      .WhitelistedMint(mintingAmount, proof)
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
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
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

  //Set up Special NFT Mint------------------------------------------------------------------------------------>

export const ClaimSpecialNFT = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }


  const mintingAmount = Number(mintAmount)
  
  const NumberMinted = Number(await nftContract.methods.numberMinted(window.ethereum.selectedAddress).call())
    if (NumberMinted < config.MAX_MINT_PUBLIC) {
      return {
        success: false,
        status: 'You are not eligible for claim special nft'
      }
     }
     
     if (NumberMinted + mintingAmount > config.MAX_MINT_PUBLIC + 1) {
      return {
        success: false,
        status: 'Exceeded special claim amount'
      }
     } 
  const MintableAmount = 1
  
  const ExceededMaxMint = MintableAmount < mintingAmount
  console.log('ExceededMaxMint',ExceededMaxMint)
    if (ExceededMaxMint) {
      return {
        success: false,
        status: 'Exceeded special claim amount'
      }
     }
     
   const claimDate = await nftContract.methods.walletSpecialNFTClaimDate(window.ethereum.selectedAddress).call()

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction

  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    gas: String(25000 * mintAmount),
    data: nftContract.methods
      .mintSpecialNFT(mintingAmount)
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
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
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
