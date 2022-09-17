const networkConfig = {
  5: {
    name: "goerli",
    ethUsdPriceFeedAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
}

const localNetworks = ["hardhat", "localhost"]
const DECIMAL = 8
const INITIAL_NUM = 200000000000

module.exports = {
  networkConfig,
  localNetworks,
  DECIMAL,
  INITIAL_NUM,
}
