const { expect, assert } = require("chai")
const { getNamedAccounts, ethers } = require("hardhat")
const { localNetworks } = require("../../helper-hardhat-config")

localNetworks.includes(network.name)
  ? describe.skip
  : describe("staging test", function () {
      it("Staging final test", async function () {
        const { deployer } = await getNamedAccounts()
        const fundMe = await ethers.getContract("FundMe", deployer)
        const TXResponse = await fundMe.fund({
          value: ethers.utils.parseEther("1.0"),
        })
        await TXResponse.wait(1)
        const TXResponseWD = await fundMe.withdraw()
        await TXResponseWD.wait(1)
        const balance = await ethers.provider.getBalance(fundMe.address)
        assert.equal(balance.toString(), "0")
      })
    })
