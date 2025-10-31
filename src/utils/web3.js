import { ethers } from "ethers";
import TokenAbi from "./MyToken.json";
import {bytecode} from "./MyTokenBin.json";

/**
 * Connect to MetaMask and return provider, signer, and account
 * @returns {Promise<{provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner, account: string, chainId: bigint} | null>}
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    console.log("Connected to:", account, "on chain:", chainId);

    return { provider, signer, account, chainId };
  } catch (error) {
    console.error("MetaMask connection failed:", error);
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
}

/**
 * Create new token by deploying a contract
 * @param {string} name - Token name
 * @param {string} symbol - Token symbol
 * @param {string | number} totalSupply - Total supply (will be converted to proper units)
 * @returns {Promise<{contract: ethers.Contract, address: string, transactionHash: string}>}
 */
export async function createToken(name, symbol, totalSupply) {
  try {
    const { provider, signer, account, chainId } = await connectWallet();
    console.log("Connected Wallet:", account);
    console.log("Network Chain ID:", chainId.toString());

    // Validate inputs
    if (!name || !symbol || !totalSupply) {
      throw new Error("Name, symbol, and totalSupply are required");
    }

    // Clean and validate inputs
    const cleanName = name.trim();
    const cleanSymbol = symbol.trim().toUpperCase();
    
    if (cleanName.length === 0 || cleanSymbol.length === 0) {
      throw new Error("Name and symbol cannot be empty");
    }

    if (cleanSymbol.length > 11) {
      throw new Error("Symbol should be 11 characters or less");
    }

    // Validate totalSupply is a positive number
    const supplyNum = parseFloat(totalSupply);
    if (isNaN(supplyNum) || supplyNum <= 0) {
      throw new Error("Total supply must be a positive number");
    }

    // Convert totalSupply to proper format (18 decimals)
    let initialSupply;
    try {
      initialSupply = ethers.parseUnits(totalSupply.toString(), 18);
    } catch (parseError) {
      throw new Error("Invalid total supply format");
    }

    console.log("Deploying token with params:", { 
      name: cleanName, 
      symbol: cleanSymbol, 
      initialSupply: initialSupply.toString() 
    });

    // Check if we have enough ETH for gas
    const balance = await provider.getBalance(account);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    if (balance < ethers.parseEther("0.001")) {
      throw new Error("Insufficient ETH balance for gas fees. You need at least 0.001 ETH.");
    }

    // Create factory with explicit gas settings
    const factory = new ethers.ContractFactory(TokenAbi, bytecode, signer);
    
    // Deploy with explicit gas settings and skip gas estimation
    console.log("Deploying contract...");
    const contract = await factory.deploy(cleanName, cleanSymbol, initialSupply, {
      gasLimit: 2000000, // Set explicit gas limit
      gasPrice: ethers.parseUnits("20", "gwei") // Set explicit gas price
    });

    console.log("Deployment transaction sent!");
    console.log("Contract address (pending):", await contract.getAddress());
    console.log("Transaction hash:", contract.deploymentTransaction().hash);

    // Return the deployment transaction immediately
    return contract.deploymentTransaction();

  } catch (error) {
    console.error("Token creation failed:", error);
    
    // Provide more specific error messages
    if (error.code === "ACTION_REJECTED" || error.code === 4001) {
      throw new Error("Transaction was rejected by user");
    } else if (error.code === "INSUFFICIENT_FUNDS" || error.code === -32000) {
      throw new Error("Insufficient funds for gas fees");
    } else if (error.message?.includes("missing revert data")) {
      throw new Error("Contract deployment failed. This might be due to network issues or invalid parameters.");
    } else if (error.message?.includes("gas")) {
      throw new Error("Gas-related error. Try again or check your network connection.");
    } else if (error.message?.includes("nonce")) {
      throw new Error("Transaction nonce error. Try refreshing and trying again.");
    } else {
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }
}

/**
 * Get token balance for an address
 * @param {string} tokenAddress - The deployed token contract address
 * @param {string} walletAddress - The wallet address to check balance for
 * @returns {Promise<string>} Balance in human-readable format
 */
export async function getTokenBalance(tokenAddress, walletAddress) {
  try {
    const { provider } = await connectWallet();
    const tokenContract = new ethers.Contract(tokenAddress, TokenAbi, provider);
    
    const balance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Failed to get token balance:", error);
    throw new Error(`Failed to get balance: ${error.message}`);
  }
}

/**
 * Listen for account changes in MetaMask
 * @param {Function} callback - Function to call when account changes
 */
export function onAccountsChanged(callback) {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask");
      } else {
        callback(accounts[0]);
      }
    });
  }
}

/**
 * Listen for network changes in MetaMask
 * @param {Function} callback - Function to call when network changes
 */
export function onChainChanged(callback) {
  if (window.ethereum) {
    window.ethereum.on("chainChanged", (chainId) => {
      callback(chainId);
      // Reload page on network change (recommended by MetaMask)
      window.location.reload();
    });
  }
}