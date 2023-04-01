require ('@nomiclabs/hardhat-etherscan')
const hre = require( 'hardhat')

const _initBaseURI='ipfs://ipfsurl/'


async function main() {

  await hre.run('verify:verify', {
    address: '0x9d98c96d58d5b4a4B73b1458d7ef05F57eb33c47',
    constructorArguments: [_initBaseURI]
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
