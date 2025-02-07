import { ethers } from "ethers";
import { abi as ContractABI } from "./TokenFactory.json"; // Import contract ABI

const FACTORY_ADDRESS = "0xc84da668d8018384b72C679C5e96a29713a9A9d9";

/**
 * Connect to MetaMask and return provider, signer, and account
 */
export async function connectWallet() {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);
    console.log("Connected Wallet:", account);
    if (chainId !== 44787n) {
      console.log("Unsupported network, switching to Sepolia");
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + (44787).toString(16) }],
      });
    }
    return { provider, signer, account, chainId };
  } catch (error) {
    console.error("MetaMask connection failed:", error);
    return null;
  }
}

/**
 * Get contract instance with a signer (for read & write)
 */
export async function getContract() {
  const { signer } = await connectWallet();
  if (!signer) return null;
  return new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);
}

/**
 * Create new token by interacting with TokenFactory contract
 */
export async function createToken(name, symbol, totalSupply) {
    const { provider, signer, account, chainId } = await connectWallet();
    console.log("Connected Wallet00000:", account);

    if (!provider) return;

    console.log(name, symbol, totalSupply, FACTORY_ADDRESS, chainId);

    const factoryContract = new ethers.Contract(
      FACTORY_ADDRESS,
      ContractABI,
      signer
    );

    // Send transaction to create the token
    const tx = await factoryContract.createToken(name, symbol, totalSupply, {
      value: 100000000000000n,
    });

    return tx;
}

/**
 * Listen for wallet changes (accounts & network)
 */
export function listenForWalletChanges(setAccount, setNetwork) {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts[0] || null);
      console.log("Account changed:", accounts[0]);
    });

    window.ethereum.on("chainChanged", (chainId) => {
      setNetwork(parseInt(chainId, 16));
      console.log("Network changed:", chainId);
    });
  }
}
