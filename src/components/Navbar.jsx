import React from 'react';
import { Coins } from 'lucide-react';

export function Navbar({ isConnected, address, onConnect }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Coins className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Token Generator</span>
          </div>
          <button
            onClick={onConnect}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isConnected
                ? 'bg-green-100 text-green-800'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
}