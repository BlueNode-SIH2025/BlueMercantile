import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import Web3Config from './Web3Config';
import { Wallet, RefreshCw, AlertTriangle, CheckCircle, Copy } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletInfo {
  address: string;
  balance: string;
  chainId: string;
  networkName: string;
}

interface WalletConnectProps {
  onWalletConnected?: (walletInfo: WalletInfo) => void;
}

const TARGET_CHAIN_ID = Web3Config.getChainId();
const TARGET_NETWORK = {
  chainId: TARGET_CHAIN_ID,
  chainName: Web3Config.getNetworkName(),
  rpcUrls: [Web3Config.getRpcUrl()],
  nativeCurrency: Web3Config.NATIVE_CURRENCY,
  blockExplorerUrls: Web3Config.BLOCK_EXPLORER_URL ? [Web3Config.BLOCK_EXPLORER_URL] : [],
};

export function WalletConnect({ onWalletConnected }: WalletConnectProps) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Get network name from chain ID
  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case '0x539':
        return 'Ganache Local';
      case '0xaa36a7':
        return 'Sepolia Testnet';
      case '0x1':
        return 'Ethereum Mainnet';
      case '0x89':
        return 'Polygon';
      case '0xa86a':
        return 'Avalanche';
      default:
        return 'Unknown Network';
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = () => {
    if (walletInfo?.address) {
      navigator.clipboard.writeText(walletInfo.address);
      toast.success('Address copied to clipboard!');
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        await updateWalletInfo();
        toast.success('Wallet connected successfully!');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet: ' + error.message);
    }
    setIsConnecting(false);
  };

  // Switch to target network (Ganache or configured network)
  const switchToTargetNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TARGET_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [TARGET_NETWORK],
          });
        } catch (addError) {
          console.error(`Error adding ${Web3Config.getNetworkName()} network:`, addError);
          toast.error(`Failed to add ${Web3Config.getNetworkName()} network`);
        }
      } else {
        console.error(`Error switching to ${Web3Config.getNetworkName()}:`, switchError);
        toast.error(`Failed to switch to ${Web3Config.getNetworkName()} network`);
      }
    }
  };

  // Update wallet information
  const updateWalletInfo = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        setWalletInfo(null);
        setIsWrongNetwork(false);
        return;
      }

      const address = accounts[0];
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const balanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });

      // Convert balance from wei to ETH
      const balanceEth = (parseInt(balanceWei, 16) / Math.pow(10, 18)).toFixed(4);
      const networkName = getNetworkName(chainId);
      const wrongNetwork = chainId !== TARGET_CHAIN_ID;

      const newWalletInfo = {
        address,
        balance: balanceEth,
        chainId,
        networkName,
      };

      setWalletInfo(newWalletInfo);
      setIsWrongNetwork(wrongNetwork);

      if (onWalletConnected && !wrongNetwork) {
        onWalletConnected(newWalletInfo);
      }
    } catch (error) {
      console.error('Error updating wallet info:', error);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletInfo(null);
    setIsWrongNetwork(false);
    toast.success('Wallet disconnected');
  };

  // Setup event listeners
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      // Check if already connected
      updateWalletInfo();

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          updateWalletInfo();
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        updateWalletInfo();
      });

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', updateWalletInfo);
          window.ethereum.removeListener('chainChanged', updateWalletInfo);
        }
      };
    }
  }, []);

  if (!isMetaMaskInstalled()) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">MetaMask Required</h3>
          <p className="text-gray-600 mb-4">
            Please install MetaMask to interact with the blockchain features.
          </p>
          <Button 
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Install MetaMask
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </h3>
        {walletInfo && (
          <Button variant="outline" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        )}
      </div>

      {!walletInfo ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connect your MetaMask wallet to access blockchain features
          </p>
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {isWrongNetwork && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <div className="flex items-center justify-between">
                  <span>Please switch to {Web3Config.getNetworkName()} to continue</span>
                  <Button 
                    size="sm" 
                    onClick={switchToTargetNetwork}
                    className="bg-orange-600 hover:bg-orange-700 ml-2"
                  >
                    Switch Network
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Wallet Address</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {formatAddress(walletInfo.address)}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Network</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isWrongNetwork ? "destructive" : "default"}>
                  {walletInfo.networkName}
                </Badge>
                {!isWrongNetwork && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">ETH Balance</label>
              <p className="text-lg font-semibold">{walletInfo.balance} ETH</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <Badge variant={isWrongNetwork ? "destructive" : "default"}>
                {isWrongNetwork ? "Wrong Network" : "Connected"}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={updateWalletInfo}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Balance
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default WalletConnect;