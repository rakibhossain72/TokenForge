# TokenForge – ERC-20 Token Generator DApp

## Overview

TokenForge is a decentralized application (DApp) designed for creating ERC-20 tokens easily and securely on the Ethereum blockchain. This project leverages the power of Hardhat for smart contract development and Vite as the frontend build tool. It is exclusively available on the Celo testnet.

## Features

- **ERC-20 Token Creation**: Seamlessly create your own ERC-20 tokens, set their name, symbol, and total supply.
- **Wallet Connection**: Interact with the application using MetaMask for wallet connectivity.
- **Network Switching**: Automatically switches to the Celo testnet if the connected wallet is on an unsupported network.
- **Transaction Feedback**: Provides real-time feedback on transaction status, including success, error, and processing states.

## Tech Stack

- **Hardhat**: Used for smart contract development, testing, and deployment. It simplifies the process of writing and testing Ethereum-based contracts.
- **Vite**: A fast and modern frontend build tool that provides an optimized development workflow for React applications.
- **Tailwind CSS**: Utilized for styling the application with utility-first CSS classes.
- **Ethers.js**: A library for interacting with the Ethereum blockchain, used here for wallet connection and contract interaction.
- **OpenZeppelin Contracts**: Secure and community-vetted smart contract library, providing robust implementations of ERC-20 and other standards.

## Setup & Installation

1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/rakibmia7254/TokenForge.git
   cd TokenForge
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**: Create a `.env` file and add your private key and Etherscan API key:
   ```plaintext
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

4. **Compile Contracts**:
   ```bash
   npx hardhat compile
   ```

5. **Deploy Contracts to Celo Testnet**:
   ```bash
   npx hardhat run scripts/deploy.cjs --network celo
   ```

6. **Start the Frontend**:
   ```bash
   npm run dev
   ```

## Usage

- Connect your MetaMask wallet and ensure you are on the Celo testnet.
- Use the interface to input token details and initiate the creation process.
- Monitor the status of your transaction and view your token on Celoscan.

## License

This project is licensed under the MIT License.

## Acknowledgements

- **Hardhat**: For providing an excellent Ethereum development environment.
- **Vite**: For making frontend development fast and efficient.
- **OpenZeppelin**: For their reliable smart contract libraries.
