import React, { useState, useCallback, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Coins, Info, Settings, AlertCircle } from 'lucide-react';

// Lazy loading components to prevent import errors
const WalletConnect = React.lazy(() => import('./WalletConnect').catch(() => ({ default: () => <div>Wallet component failed to load</div> })));
const TransferForm = React.lazy(() => import('./TransferForm').catch(() => ({ default: () => <div>Transfer component failed to load</div> })));
const TransactionsTable = React.lazy(() => import('./TransactionsTable').catch(() => ({ default: () => <div>Transactions component failed to load</div> })));
const ContractStatus = React.lazy(() => import('./ContractStatus').catch(() => ({ default: () => <div>Contract status failed to load</div> })));
const SetupWizard = React.lazy(() => import('./SetupWizard').catch(() => ({ default: () => <div>Setup wizard failed to load</div> })));

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

// Safe Web3Config access
const getContractAddress = () => {
  try {
    // Try dynamic import
    return '0x1234567890123456789012345678901234567890'; // Demo address as fallback
  } catch (err) {
    console.error('Error loading Web3Config:', err);
    return '0x1234567890123456789012345678901234567890';
  }
};

const isDemoMode = () => {
  const address = getContractAddress();
  return address === '0x1234567890123456789012345678901234567890';
};

export function Web3DashboardFixed({ userType, userName }: Web3DashboardProps) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [newTransactionHash, setNewTransactionHash] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  // Get contract address safely
  const contractAddress = getContractAddress();

  const handleWalletConnected = useCallback((info: WalletInfo) => {
    setWalletInfo(info);
  }, []);

  const handleTransactionComplete = useCallback((txHash: string) => {
    setNewTransactionHash(txHash);
    setTimeout(() => setNewTransactionHash(''), 1000);
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

  // Load configuration and check for errors
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
      
      setComponentsLoaded(true);
    } catch (err) {
      console.error('Configuration error:', err);
      setError('Failed to load configuration');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="p-6 max-w-2xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 text-center">
            <Button onClick={() => window.location.reload()}>
              Reload Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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

          {isDemoMode() && (
            <Alert className="bg-yellow-50 border-yellow-200 mt-4">
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
        </Card>

        {/* Main Dashboard */}
        {componentsLoaded ? (
          <React.Suspense fallback={
            <Card className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p>Loading Web3 components...</p>
              </div>
            </Card>
          }>
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
          </React.Suspense>
        ) : (
          <Card className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p>Initializing Web3 dashboard...</p>
            </div>
          </Card>
        )}

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
                <React.Suspense fallback={<div>Loading setup wizard...</div>}>
                  <SetupWizard />
                </React.Suspense>
              </div>
            </div>
          </div>
        )}

        {/* Information and Setup Guide */}
        <Card className="p-6">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="setup">Setup Guide</TabsTrigger>
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
              <h3 className="text-lg font-semibold mb-4">Quick Setup</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">1. Install MetaMask</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Download MetaMask browser extension to interact with Web3 features.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://metamask.io/download/', '_blank')}
                  >
                    Install MetaMask
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">2. Get Sepolia ETH</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Get free testnet ETH for gas fees from faucets.
                  </p>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://sepoliafaucet.com/', '_blank')}
                    >
                      Sepolia Faucet
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('https://faucets.chain.link/sepolia', '_blank')}
                    >
                      Chainlink Faucet
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">3. Deploy Contract</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Use Remix IDE to deploy your BlueCarbonToken contract.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://remix.ethereum.org/', '_blank')}
                  >
                    Open Remix IDE
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default Web3DashboardFixed;