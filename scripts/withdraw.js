const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  const sendValue = ethers.utils.parseEther("1.0")

  console.log("Withdrawing...")
  const TXResponse = await fundMe.withdraw()
  await TXResponse.wait(1)
  console.log("Withdraw completed.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
