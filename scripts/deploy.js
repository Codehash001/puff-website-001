const hre = require('hardhat')

const _initBaseURI='ipfs://bafybeiajl7wr67f2b7aiefrakv2w6quog5sqhf6p3ii5b2euushg3rl5hy/'

async function main() {

  // Deploy the contract
  const contract = await hre.ethers.getContractFactory('MaskTalisman')
  const Contract = await contract.deploy(
    _initBaseURI)
  await Contract.deployed()

  console.log('Contract deployed to:', Contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
