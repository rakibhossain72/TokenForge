import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { TokenForm } from "./components/TokenForm";
import { Footer } from "./components/Footer";
import { connectWallet, createToken } from "./utils/web3";
import { Model as ModalComp } from "./components/Model";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [model, setModel] = useState({
    isOpen: false,
    message: "",
    status: "",
    txHash: "",
  });

  const closeModal = () => {
    setModel({
      isOpen: false,
      message: "",
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("Accounts changed:", accounts);
        if (accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        } else {
          setIsConnected(false);
          setAddress(null);
        }
      });
    }
  }, []);

  const handleConnect = async () => {
    const wallet = await connectWallet();
    if (wallet) {
      setIsConnected(true);
      setAddress(wallet.account);
    }
  };

  const handleCreateToken = async (tokenData) => {
    if (!isConnected) {
      setModel({
        isOpen: true,
        message: "Please connect your wallet first",
        status: "error",
      });
    }
    try {
      setModel({
        isOpen: true,
        message: "Token creation in progress...",
        status: "loading",
      });
      const tx = await createToken(
        tokenData.name,
        tokenData.symbol,
        tokenData.totalSupply
      );


      await tx.wait();

      if (tx) {
        setModel({
          isOpen: true,
          message: "Token created successfully",
          status: "success",
          txHash: tx.hash,
        });
      }
      return true;
    } catch (error) {
      console.error("Transaction Error:", error);

      let errorMessage = "An error occurred";

      if (error.code === "ACTION_REJECTED") {
        errorMessage = "User denied the transaction";
      } else if (error.code === -32603) {
        errorMessage = "Internal JSON-RPC error";
      } else if (error.code === -32000) {
        errorMessage = "Insufficient funds for gas";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Not enough ETH for gas fees";
      } else if (error.message?.includes("nonce too low")) {
        errorMessage = "Nonce too low. Try increasing gas fees";
      } else if (
        error.message?.includes("replacement transaction underpriced")
      ) {
        errorMessage = "Gas price too low for replacement transaction";
      } else if (error.code === -32602) {
        errorMessage = "Invalid parameters sent to RPC";
      } else if (error.message?.includes("execution reverted")) {
        errorMessage =
          "Transaction execution reverted. Check contract conditions.";
      }

      setModel({
        isOpen: true,
        message: errorMessage,
        status: "error",
      });

      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar
        isConnected={isConnected}
        address={address}
        onConnect={handleConnect}
      />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Create Your Own{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                ERC-20 Token
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Enter the details of your token, and let us deploy it on the
              blockchain!
            </p>
          </div>

          <div className="flex justify-center">
            <TokenForm onSubmit={handleCreateToken} isConnected={isConnected} />
          </div>

          <ModalComp
            isOpen={model.isOpen}
            onClose={closeModal}
            message={model.message}
            status={model.status}
            txHash={model.txHash}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
