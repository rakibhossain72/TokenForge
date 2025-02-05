import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export function TokenForm({ onSubmit, isConnected }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [error, setError] = useState('');
  const [network, setNetwork] = useState('sepolia');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!name || !symbol || !totalSupply) {
      setError('All fields are required');
      return;
    }

    try {
      await onSubmit({ name, symbol, totalSupply });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Token Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="My Token"
        />
      </div>

      <div>
        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
          Token Symbol
        </label>
        <input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="mt-1 block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="MTK"
        />
      </div>

      <div>
        <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700">
          Total Supply
        </label>
        <input
          type="number"
          id="totalSupply"
          value={totalSupply}
          onChange={(e) => setTotalSupply(e.target.value)}
          className="mt-1 block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="1000000"
        />
      </div>

      <div>
        <label htmlFor="network" className="block text-sm font-medium text-gray-700">
          Network
        </label>
        <select
          id="network"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="mt-1 block w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="mainnet">Sepolia</option>
          <option value="holesky">Holesky</option>
        </select>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          A fee of 0.01 ETH will be charged for token creation
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isConnected}
      >
        Create Token
      </button>
    </form>
  );
}