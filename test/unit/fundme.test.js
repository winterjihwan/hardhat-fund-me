const { expect, assert } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const { localNetworks } = require("../../helper-hardhat-config")

!localNetworks.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      let deployer, mockV3Aggregator, fundMe
      const sendValue = ethers.utils.parseEther("1.0")
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture()
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        )
      })

      describe("constructor", function () {
        it("mockv3aggregator address and pricefeed match", async function () {
          const expect = await fundMe.priceFeed()
          assert.equal(expect, mockV3Aggregator.address)
        })
      })

      describe("fund", function () {
        it("should revert funds with 0 value", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          )
        })
        it("should add funder to funders arrary", async () => {
          await fundMe.fund({ value: sendValue })
          const funder = await fundMe.funders(0)
          assert.equal(funder, deployer)
        })
        it("should add the right amount of funds", async () => {
          await fundMe.fund({ value: sendValue })
          const fundAmount = await fundMe.addressToAmountFunded(deployer)
          assert.equal(sendValue.toString(), fundAmount.toString())
        })
      })

      describe("withdraw", function () {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue })
        })
        it("withdraw the correct amount", async () => {
          const startingFundMe = await ethers.provider.getBalance(
            fundMe.address
          )
          const startingDeployer = await ethers.provider.getBalance(deployer)

          const TXResponse = await fundMe.withdraw()
          const TXReceipt = await TXResponse.wait(1)
          const { effectiveGasPrice, gasUsed } = TXReceipt
          const gasPrice = effectiveGasPrice.mul(gasUsed)

          const endingFundMe = await ethers.provider.getBalance(fundMe.address)
          const endingDeployer = await ethers.provider.getBalance(deployer)
          assert.equal(
            startingFundMe.add(startingDeployer).toString(),
            endingDeployer.add(gasPrice).toString()
          )
        })
        it("be able to withdraw with multiple accounts", async () => {
          const accounts = await ethers.getSigners()
          for (let i = 1; i < 6; i++) {
            const connectedContract = await fundMe.connect(accounts[i])
            await connectedContract.fund({ value: sendValue })
          }
          const startingFundMe = await ethers.provider.getBalance(
            fundMe.address
          )
          const startingDeployer = await ethers.provider.getBalance(deployer)

          const TXResponse = await fundMe.withdraw()
          const TXReceipt = await TXResponse.wait(1)
          const { effectiveGasPrice, gasUsed } = TXReceipt
          const gasPrice = effectiveGasPrice.mul(gasUsed)

          const endingFundMe = await ethers.provider.getBalance(fundMe.address)
          const endingDeployer = await ethers.provider.getBalance(deployer)

          assert.equal(
            startingFundMe.add(startingDeployer).toString(),
            endingDeployer.add(gasPrice).toString()
          )
          await expect(fundMe.funders(0)).to.be.reverted
          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.addressToAmountFunded(accounts[i].address),
              0
            )
          }
        })
        it("should prevent attacker from withdrawing", async () => {
          const accounts = await ethers.getSigners()
          const attacker = accounts[1]
          const connectedContract = await fundMe.connect(attacker)
          await expect(connectedContract.withdraw()).to.be.reverted
        })
      })
    })
