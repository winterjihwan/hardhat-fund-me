const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  const sendValue = ethers.utils.parseEther("1.0")

  console.log("Funding...")
  const TXResponse = await fundMe.fund({ value: sendValue })
  await TXResponse.wait(1)
  console.log("Fund completed.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
