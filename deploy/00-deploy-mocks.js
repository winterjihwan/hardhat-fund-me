const {
  localNetworks,
  DECIMAL,
  INITIAL_NUM,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  if (localNetworks.includes(network.name)) {
    log("Local Network Detected. Syncing...")
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMAL, INITIAL_NUM],
    })
  }
  log("-----------------------------------")
}
module.exports.tags = ["all", "mocks"]
