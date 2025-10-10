import React, { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';

const SOMNIA_NETWORK = {
  chainId: 5031,
  chainName: 'SOMNIA MAINNET',
  nativeCurrency: {
    name: 'SOMI',
    symbol: 'SOMI',
    decimals: 18,
  },
  rpcUrls: ['https://api.infra.mainnet.somnia.network/'],
  blockExplorerUrls: ['https://explorer.somnia.network/'],
} as const;

export const NetworkHelper: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [showAddNetwork, setShowAddNetwork] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isConnected && chainId && chainId !== SOMNIA_NETWORK.chainId) {
      setShowAddNetwork(true);
    } else {
      setShowAddNetwork(false);
    }
  }, [isConnected, chainId]);

  const addSomniaNetwork = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Ethereum wallet');
      return;
    }

    setIsAdding(true);

    try {
      // First try to switch to the network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${SOMNIA_NETWORK.chainId.toString(16)}` }],
        });
        setShowAddNetwork(false); // Hide warning after successful switch
      } catch (switchError: any) {
        console.log('Switch error:', switchError);
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${SOMNIA_NETWORK.chainId.toString(16)}`,
                  chainName: SOMNIA_NETWORK.chainName,
                  nativeCurrency: SOMNIA_NETWORK.nativeCurrency,
                  rpcUrls: SOMNIA_NETWORK.rpcUrls,
                  blockExplorerUrls: SOMNIA_NETWORK.blockExplorerUrls,
                },
              ],
            });
            setShowAddNetwork(false); // Hide warning after successful addition
          } catch (addError: any) {
            console.error('Failed to add network:', addError);
            if (addError.code === 4001) {
              // User rejected the request
              alert('Network addition was rejected. You can add the Somnia network manually in your wallet settings.');
            } else {
              alert('Failed to add Somnia network. Please add it manually.');
            }
          }
        } else if (switchError.code === 4001) {
          // User rejected the request
          alert('Network switch was rejected.');
        } else {
          console.error('Failed to switch network:', switchError);
          alert('Failed to switch to Somnia network. Please switch manually.');
        }
      }
    } catch (error) {
      console.error('Network operation failed:', error);
      alert('Network operation failed. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const switchToSomnia = async () => {
    // Always use the manual method for better compatibility
    addSomniaNetwork();
  };

  if (!isConnected || !showAddNetwork) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Wrong Network Detected
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              This application requires the Somnia Network. You're currently connected to a different network.
            </p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={switchToSomnia}
              disabled={isAdding}
              className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                isAdding
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              } transition-colors`}
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Adding Network...
                </>
              ) : (
                'Switch to Somnia Network'
              )}
            </button>
            <button
              onClick={() => setShowAddNetwork(false)}
              className="inline-flex items-center justify-center px-4 py-2 border border-yellow-300 text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors"
            >
              Dismiss
            </button>
          </div>
          <div className="mt-3 text-xs text-yellow-600">
            <strong>Network Details:</strong><br />
            Chain ID: {SOMNIA_NETWORK.chainId} | Symbol: {SOMNIA_NETWORK.nativeCurrency.symbol} | RPC: {SOMNIA_NETWORK.rpcUrls[0]}
          </div>
        </div>
      </div>
    </div>
  );
};