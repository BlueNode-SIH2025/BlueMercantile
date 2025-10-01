import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import WalletConnect from './WalletConnect';
import TransferForm from './TransferForm';
import TransactionsTable from './TransactionsTable';
import ContractStatus from './ContractStatus';
import SetupWizard from './SetupWizard';
import Web3Config from './Web3Config';
import { Coins, Send, History, Info, ExternalLink, Settings } from 'lucide-react';

interface WalletInfo {
  address: string;
  balance: string;
  chainId: string;
  networkName: string;
}

interface Web3DashboardProps {
  userType: 'patron' | 'credit_client';
  userName: string;
}

export function Web3Dashboard({ userType, userName }: Web3DashboardProps) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [newTransactionHash, setNewTransactionHash] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  // Get contract address from Web3 configuration with error handling
  const contractAddress = useMemo(() => {
    try {
      return Web3Config.getContractAddress();
    } catch (err) {
      console.error('Error getting contract address:', err);
      return '0x1234567890123456789012345678901234567890';
    }
  }, []);

  const handleWalletConnected = useCallback((info: WalletInfo) => {
    setWalletInfo(info);
  }, []);

  const handleTransactionComplete = useCallback((txHash: string) => {
    setNewTransactionHash(txHash);
    // Reset after a delay to avoid duplicate entries
    setTimeout(() => setNewTransactionHash(''), 1000);
  }, []);

  // Load configuration script and handle errors
  useEffect(() => {
    try {
      // Load stored contract address from localStorage
      if (typeof window !== 'undefined') {
        const storedAddress = localStorage.getItem('BLUEMERCANTILE_CONTRACT_ADDRESS');
        if (storedAddress) {
          if (!(window as any).ENV) {
            (window as any).ENV = {};
          }
          (window as any).ENV.NEXT_PUBLIC_CONTRACT_ADDRESS = storedAddress;
        }
      }
      
      // Check for configuration errors
      Web3Config.getContractAddress();
    } catch (err) {
      console.error('Configuration error:', err);
      setError('Failed to load contract configuration');
    }
  }, []);

  const getWelcomeMessage = () => {
    if (userType === 'patron') {
      return `Welcome, ${userName}! As a patron, you can receive BlueCarbonTokens (BCT) for your carbon credit activities and transfer them to other participants.`;
    } else {
      return `Welcome, ${userName}! As a credit client, you can purchase and transfer BlueCarbonTokens (BCT) to support carbon credit initiatives.`;
    }
  };

  const getFeaturesList = () => {
    const commonFeatures = [
      'Connect your MetaMask wallet',
      'View your BCT token balance',
      'Transfer tokens to other addresses',
      'Track transaction history',
      'All transactions on Sepolia testnet'
    ];

    if (userType === 'patron') {
      return [
        'Receive BCT for verified plantation activities',
        ...commonFeatures
      ];
    } else {
      return [
        'Purchase BCT to support carbon initiatives',
        ...commonFeatures
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white p-3 rounded-lg">
                <Coins className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  BlueMercantile Web3 Dashboard
                </h1>
                <p className="text-gray-600 capitalize">
                  {userType.replace('_', ' ')} Portal
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Sepolia Testnet
            </Badge>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {getWelcomeMessage()}
            </AlertDescription>
          </Alert>

          {Web3Config.isDemoMode() && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <Info className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <div className="flex items-center justify-between">
                  <span>
                    <strong>Demo Mode:</strong> Deploy your own contract for full functionality.
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => setShowSetup(true)}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Setup
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="bg-red-50 border-red-200">
              <Info className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </Card>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <WalletConnect onWalletConnected={handleWalletConnected} />
            <ContractStatus 
              contractAddress={contractAddress}
              walletConnected={!!walletInfo}
            />
          </div>

          {/* Right Column - Transfer Form */}
          <div className="lg:col-span-2">
            <TransferForm 
              walletAddress={walletInfo?.address}
              contractAddress={contractAddress}
              onTransactionComplete={handleTransactionComplete}
            />
          </div>
        </div>

        {/* Transactions Table */}
        <TransactionsTable 
          walletAddress={walletInfo?.address}
          contractAddress={contractAddress}
          newTransactionHash={newTransactionHash}
        />

        {/* Setup Wizard Modal */}
        {showSetup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Web3 Setup</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSetup(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-4">
                <SetupWizard />
              </div>
            </div>
          </div>
        )}

        {/* Information and Setup Guide */}
        <Card className="p-6">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="setup">Setup Guide</TabsTrigger>
              <TabsTrigger value="contract">Smart Contract</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Platform Features</h3>
              <ul className="space-y-2">
                {getFeaturesList().map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="setup" className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">1. Install MetaMask</h4>
                  <p className="text-sm text-gray-600">
                    Download and install MetaMask browser extension from{' '}
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      metamask.io <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">2. Get Sepolia ETH</h4>
                  <p className="text-sm text-gray-600">
                    Get free Sepolia testnet ETH from these faucets:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <a 
                        href="https://sepoliafaucet.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
                      >
                        Sepolia Faucet <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://faucets.chain.link/sepolia" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 text-sm"
                      >
                        Chainlink Faucet <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">3. Connect to Sepolia</h4>
                  <p className="text-sm text-gray-600">
                    The dashboard will automatically prompt you to switch to Sepolia testnet when you connect your wallet.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contract" className="mt-6">
              <h3 className="text-lg font-semibold mb-4">BlueCarbonToken Contract</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Contract Address</h4>
                  <code className="text-sm bg-white px-2 py-1 rounded border">
                    {contractAddress}
                  </code>
                  <p className="text-xs text-gray-600 mt-1">
                    {Web3Config.isDemoMode() ? (
                      <>
                        Demo address. Set your contract address in browser console:
                        <br />
                        <code className="text-xs">setContractAddress('0x...')</code>
                      </>
                    ) : (
                      'Custom contract address configured'
                    )}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Token Details</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Symbol: BCT (BlueCarbonToken)</li>
                    <li>• Decimals: 18</li>
                    <li>• Type: ERC20-compatible</li>
                    <li>• Network: Sepolia Testnet</li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Smart Contract Functions</h4>
                  <ul className="text-sm space-y-1">
                    <li>• <code>transfer(to, amount)</code> - Transfer tokens</li>
                    <li>• <code>balanceOf(account)</code> - Check balance</li>
                    <li>• <code>decimals()</code> - Get token decimals</li>
                    <li>• <code>symbol()</code> - Get token symbol</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default Web3Dashboard;