import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import Web3Config from './Web3Config';

interface ContractStatusProps {
  contractAddress: string;
  walletConnected: boolean;
}

interface ContractInfo {
  isDeployed: boolean;
  isValid: boolean;
  hasCode: boolean;
  network?: string;
  error?: string;
}

export function ContractStatus({ contractAddress, walletConnected }: ContractStatusProps) {
  const [contractInfo, setContractInfo] = useState<ContractInfo>({
    isDeployed: false,
    isValid: false,
    hasCode: false
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkContractStatus = async () => {
    if (!contractAddress || !walletConnected) return;

    setIsChecking(true);
    try {
      // Import ethers dynamically
      const { ethers } = await import('ethers');
      
      if (!window.ethereum) {
        setContractInfo({
          isDeployed: false,
          isValid: false,
          hasCode: false,
          error: 'MetaMask not found'
        });
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      // Check if address is valid
      const isValidAddress = ethers.isAddress(contractAddress);
      if (!isValidAddress) {
        setContractInfo({
          isDeployed: false,
          isValid: false,
          hasCode: false,
          network: network.name,
          error: 'Invalid contract address'
        });
        return;
      }

      // Check if there's code at the address
      const code = await provider.getCode(contractAddress);
      const hasCode = code && code !== '0x';
      
      let contractValid = false;
      if (hasCode) {
        try {
          // Try to call a basic function to verify it's our contract
          const contract = new ethers.Contract(contractAddress, [
            "function symbol() public view returns (string)",
            "function decimals() public view returns (uint8)"
          ], provider);
          
          const symbol = await contract.symbol();
          contractValid = symbol === 'BCT'; // Our token symbol
        } catch (error) {
          console.log('Contract validation failed:', error);
        }
      }

      setContractInfo({
        isDeployed: hasCode,
        isValid: contractValid,
        hasCode,
        network: network.name,
        error: undefined
      });

    } catch (error: any) {
      console.error('Error checking contract status:', error);
      setContractInfo({
        isDeployed: false,
        isValid: false,
        hasCode: false,
        error: error.message
      });
    }
    setIsChecking(false);
  };

  useEffect(() => {
    if (walletConnected && contractAddress) {
      checkContractStatus();
    }
  }, [contractAddress, walletConnected]);

  const isDemoMode = Web3Config.isDemoMode();
  const isSepoliaAddress = contractAddress.startsWith('0x') && contractAddress.length === 42 && !isDemoMode;

  if (!walletConnected) {
    return null;
  }

  if (isDemoMode) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">Demo Mode</h4>
            <p className="text-sm text-gray-600">Deploy your contract to enable real transactions</p>
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Demo
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Contract Status</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={checkContractStatus}
          disabled={isChecking}
        >
          {isChecking ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Contract Address:</span>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => window.open(`https://sepolia.etherscan.io/address/${contractAddress}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Network:</span>
          <span className="text-sm font-medium">{contractInfo.network || 'Unknown'}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Contract Deployed:</span>
          <div className="flex items-center gap-2">
            {contractInfo.isDeployed ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={contractInfo.isDeployed ? "default" : "destructive"}>
              {contractInfo.isDeployed ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">BlueCarbonToken:</span>
          <div className="flex items-center gap-2">
            {contractInfo.isValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={contractInfo.isValid ? "default" : "destructive"}>
              {contractInfo.isValid ? "Valid" : "Invalid"}
            </Badge>
          </div>
        </div>

        {contractInfo.error && (
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {contractInfo.error}
            </AlertDescription>
          </Alert>
        )}

        {!contractInfo.isDeployed && !contractInfo.error && (
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              No contract found at this address. Please deploy your BlueCarbonToken contract using{' '}
              <Button
                variant="link"
                className="h-auto p-0 text-blue-600"
                onClick={() => window.open('https://remix.ethereum.org/', '_blank')}
              >
                Remix IDE
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}

export default ContractStatus;