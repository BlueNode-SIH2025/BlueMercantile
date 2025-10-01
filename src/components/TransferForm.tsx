import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';
import { Send, RefreshCw, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface TransferFormProps {
  walletAddress?: string;
  contractAddress?: string;
  onTransactionComplete?: (txHash: string) => void;
}

// Simple ABI for our BlueCarbonToken contract
const TOKEN_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)",
  "function symbol() public view returns (string)"
];

export function TransferForm({ walletAddress, contractAddress, onTransactionComplete }: TransferFormProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Validate Ethereum address
  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  // Validate contract address
  const isValidContractAddress = (address: string) => {
    return address && address.startsWith('0x') && address.length === 42 && address !== '0x1234567890123456789012345678901234567890';
  };

  // Get token balance
  const getTokenBalance = async () => {
    if (!walletAddress || !contractAddress) return;

    // Check if we're using demo address
    if (!isValidContractAddress(contractAddress)) {
      setTokenBalance('1000.0'); // Demo balance
      return;
    }

    setIsLoadingBalance(true);
    try {
      // Import ethers dynamically
      const { ethers } = await import('ethers');
      
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Check if we're on the right network
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) { // Sepolia chain ID
        throw new Error('Please switch to Sepolia testnet');
      }
      
      // First check if there's code at the contract address
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        throw new Error('No contract found at this address. Please deploy the contract first.');
      }

      const contract = new ethers.Contract(contractAddress, TOKEN_ABI, provider);
      
      // Try to get balance with timeout
      const balancePromise = contract.balanceOf(walletAddress);
      const decimalsPromise = contract.decimals();
      const symbolPromise = contract.symbol();
      
      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const [balance, decimals, symbol] = await Promise.race([
        Promise.all([balancePromise, decimalsPromise, symbolPromise]),
        timeout
      ]) as [bigint, number, string];
      
      const formattedBalance = ethers.formatUnits(balance, decimals);
      setTokenBalance(formattedBalance);
      
      toast.success(`Balance updated: ${formattedBalance} ${symbol}`);
    } catch (error: any) {
      console.error('Error getting token balance:', error);
      
      // Provide specific error messages
      let errorMessage = 'Failed to get token balance';
      if (error.message.includes('No contract found')) {
        errorMessage = 'Contract not deployed. Please deploy your BlueCarbonToken contract first.';
        setTokenBalance('0.0');
      } else if (error.message.includes('could not decode result data')) {
        errorMessage = 'Invalid contract or wrong network. Verify contract address and network.';
        setTokenBalance('0.0');
      } else if (error.message.includes('switch to Sepolia')) {
        errorMessage = 'Please switch to Sepolia testnet';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
    setIsLoadingBalance(false);
  };

  // Transfer tokens
  const transferTokens = async () => {
    if (!walletAddress || !contractAddress) {
      toast.error('Wallet not connected or contract address not set');
      return;
    }

    // Check if we're using demo address
    if (!isValidContractAddress(contractAddress)) {
      toast.error('Demo mode: Please deploy your contract and set the address first');
      return;
    }

    if (!isValidAddress(recipient)) {
      toast.error('Please enter a valid recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsTransferring(true);
    try {
      // Import ethers dynamically
      const { ethers } = await import('ethers');
      
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Check network first
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) {
        throw new Error('Please switch to Sepolia testnet');
      }
      
      // Check if contract exists
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        throw new Error('Contract not found. Please deploy your BlueCarbonToken contract first.');
      }
      
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, TOKEN_ABI, signer);
      
      // Get token decimals
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      
      // Convert amount to proper units
      const transferAmount = ethers.parseUnits(amount, decimals);
      
      // Check if user has enough balance
      const balance = await contract.balanceOf(walletAddress);
      if (balance < transferAmount) {
        throw new Error('Insufficient token balance');
      }

      // Execute transfer
      const tx = await contract.transfer(recipient, transferAmount);
      
      toast.success('Transaction submitted! Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success(`Transfer successful! ${amount} ${symbol} sent to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
        
        // Reset form
        setRecipient('');
        setAmount('');
        
        // Refresh balance
        await getTokenBalance();
        
        // Notify parent component
        if (onTransactionComplete) {
          onTransactionComplete(receipt.hash);
        }
      } else {
        throw new Error('Transaction failed');
      }
      
    } catch (error: any) {
      console.error('Transfer error:', error);
      
      // Handle specific error types
      if (error.code === 4001) {
        toast.error('Transaction cancelled by user');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient ETH for gas fees');
      } else if (error.message.includes('Insufficient token balance')) {
        toast.error('Insufficient token balance');
      } else {
        toast.error('Transfer failed: ' + error.message);
      }
    }
    setIsTransferring(false);
  };

  // Load token balance on component mount and when dependencies change
  React.useEffect(() => {
    if (walletAddress && contractAddress) {
      getTokenBalance();
    }
  }, [walletAddress, contractAddress]);

  if (!walletAddress) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Connect your wallet to transfer tokens</p>
        </div>
      </Card>
    );
  }

  if (!contractAddress) {
    return (
      <Card className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in your environment variables.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Send className="h-5 w-5" />
          Transfer BlueCarbonTokens
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={getTokenBalance}
          disabled={isLoadingBalance}
        >
          {isLoadingBalance ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isValidContractAddress(contractAddress) && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Demo Mode:</strong> Using demo contract address. Deploy your BlueCarbonToken contract and run{' '}
            <code className="bg-yellow-100 px-1 rounded">setContractAddress('0x...')</code> in browser console to enable real transfers.
          </AlertDescription>
        </Alert>
      )}

      <div className={`mb-6 p-4 rounded-lg ${
        !isValidContractAddress(contractAddress) 
          ? 'bg-yellow-50 border border-yellow-200' 
          : 'bg-green-50'
      }`}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Your Token Balance:
            {!isValidContractAddress(contractAddress) && (
              <span className="text-xs text-yellow-600 ml-1">(Demo)</span>
            )}
          </span>
          <span className={`text-lg font-bold ${
            !isValidContractAddress(contractAddress) 
              ? 'text-yellow-600' 
              : 'text-green-600'
          }`}>
            {tokenBalance} BCT
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient Address *</Label>
          <Input
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className={!isValidAddress(recipient) && recipient ? 'border-red-300' : ''}
          />
          {recipient && !isValidAddress(recipient) && (
            <p className="text-sm text-red-600 mt-1">Please enter a valid Ethereum address</p>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Amount (BCT) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.000001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">Available: {tokenBalance} BCT</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto p-0"
              onClick={() => setAmount(tokenBalance)}
              disabled={!tokenBalance || tokenBalance === '0'}
            >
              Use Max
            </Button>
          </div>
        </div>

        <Button 
          onClick={transferTokens}
          disabled={
            isTransferring || 
            !recipient || 
            !amount || 
            !isValidAddress(recipient) ||
            !isValidContractAddress(contractAddress)
          }
          className={`w-full ${
            !isValidContractAddress(contractAddress)
              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isTransferring ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Transferring...
            </>
          ) : !isValidContractAddress(contractAddress) ? (
            <>
              <Send className="h-4 w-4 mr-2" />
              Deploy Contract First
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Transfer Tokens
            </>
          )}
        </Button>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Make sure you have enough ETH for gas fees. Transactions on Sepolia testnet typically cost 0.0001-0.001 ETH.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
}

export default TransferForm;