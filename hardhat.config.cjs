require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://eth-sepolia.public.blastapi.io",
      accounts: [process.env.PRIVATE_KEY]
    },
    holesky: {
      url: "https://1rpc.io/holesky",
      accounts: [process.env.PRIVATE_KEY]
    },
    celo: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};