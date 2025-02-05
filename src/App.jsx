import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Navbar } from './components/Navbar';
import { TokenForm } from './components/TokenForm';
import { Footer } from './components/Footer';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tokenAddress, setTokenAddress] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAddress(accounts[0]);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleCreateToken = async (tokenData) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Here you would typically:
      // 1. Deploy the ERC-20 contract
      // 2. Handle the transaction
      // 3. Wait for confirmation
      
      // For demo purposes, we'll just show a success message
      setTokenAddress('0x1234...5678');
      setShowSuccess(true);
    } catch (err) {
      console.error('Failed to create token:', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar isConnected={isConnected} address={address} onConnect={connectWallet} />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Create Your Own{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                ERC-20 Token
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Enter the details of your token, and let us deploy it on the blockchain!
            </p>
          </div>

          <div className="flex justify-center">
            <TokenForm onSubmit={handleCreateToken} isConnected={isConnected} />
          </div>

          {showSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900">Token Created Successfully!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your token has been deployed to: {tokenAddress}
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;