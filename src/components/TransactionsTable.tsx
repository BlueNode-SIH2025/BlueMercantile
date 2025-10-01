import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { ExternalLink, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
}

interface TransactionsTableProps {
  walletAddress?: string;
  contractAddress?: string;
  newTransactionHash?: string;
}

export function TransactionsTable({ walletAddress, contractAddress, newTransactionHash }: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Get transaction status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get transaction status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary' as const;
      case 'success':
        return 'default' as const;
      case 'failed':
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  // Fetch transactions from localStorage or mock data
  const fetchTransactions = async () => {
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      // In a real application, you would fetch from an API or blockchain explorer
      // For this demo, we'll use localStorage to persist transactions
      const storedTxs = localStorage.getItem(`transactions_${walletAddress}`);
      const existingTransactions = storedTxs ? JSON.parse(storedTxs) : [];

      // Add some mock transactions for demonstration
      if (existingTransactions.length === 0) {
        const mockTransactions: Transaction[] = [
          {
            hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            from: walletAddress,
            to: '0x742d35cc6651c80b4e4c2d2e4f4d2e4f4d2e4f4d',
            value: '100.0',
            timestamp: Math.floor(Date.now() / 1000) - 3600,
            status: 'success',
            gasUsed: '21000',
            gasPrice: '20',
            blockNumber: 12345678,
          },
          {
            hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            from: '0x742d35cc6651c80b4e4c2d2e4f4d2e4f4d2e4f4d',
            to: walletAddress,
            value: '50.0',
            timestamp: Math.floor(Date.now() / 1000) - 7200,
            status: 'success',
            gasUsed: '21000',
            gasPrice: '18',
            blockNumber: 12345677,
          },
        ];

        setTransactions(mockTransactions);
        localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(mockTransactions));
      } else {
        setTransactions(existingTransactions);
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions');
    }

    setIsLoading(false);
  };

  // Add new transaction to the list
  const addTransaction = (txHash: string) => {
    if (!walletAddress) return;

    const newTransaction: Transaction = {
      hash: txHash,
      from: walletAddress,
      to: '0x0000000000000000000000000000000000000000', // Placeholder
      value: '0',
      timestamp: Math.floor(Date.now() / 1000),
      status: 'pending',
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(updatedTransactions));

    // Simulate transaction confirmation after 5 seconds
    setTimeout(() => {
      const confirmedTransactions = updatedTransactions.map(tx => 
        tx.hash === txHash ? { ...tx, status: 'success' as const } : tx
      );
      setTransactions(confirmedTransactions);
      localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(confirmedTransactions));
    }, 5000);
  };

  // Check for new transactions when newTransactionHash changes
  useEffect(() => {
    if (newTransactionHash) {
      addTransaction(newTransactionHash);
    }
  }, [newTransactionHash]);

  // Fetch transactions when wallet address changes
  useEffect(() => {
    fetchTransactions();
  }, [walletAddress]);

  // Refresh transactions periodically
  useEffect(() => {
    if (!walletAddress) return;

    const interval = setInterval(() => {
      // In a real app, you would check transaction status here
      // For demo purposes, we'll just update pending transactions to success
      setTransactions(prev => prev.map(tx => 
        tx.status === 'pending' && Date.now() - (tx.timestamp * 1000) > 30000
          ? { ...tx, status: 'success' as const }
          : tx
      ));
    }, 10000);

    return () => clearInterval(interval);
  }, [walletAddress]);

  if (!walletAddress) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Connect your wallet to view transaction history</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchTransactions}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>

      {error && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-8 w-8 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No transactions found</p>
          <p className="text-sm text-gray-400 mt-2">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Transaction Hash</th>
                <th className="text-left py-3 px-2">From/To</th>
                <th className="text-left py-3 px-2">Amount</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Time</th>
                <th className="text-left py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={tx.hash} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {formatAddress(tx.hash)}
                    </code>
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-xs">
                      <div className="text-gray-500">From: {formatAddress(tx.from)}</div>
                      <div className="text-gray-500">To: {formatAddress(tx.to)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2 font-medium">
                    {tx.value} BCT
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <Badge variant={getStatusVariant(tx.status)}>
                        {tx.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-xs text-gray-500">
                    {formatTimestamp(tx.timestamp)}
                  </td>
                  <td className="py-3 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(`https://sepolia.etherscan.io/tx/${tx.hash}`, '_blank')}
                      title="View on Etherscan"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Transactions are shown for the connected wallet address</p>
        <p>Click the external link icon to view transaction details on Etherscan</p>
      </div>
    </Card>
  );
}

export default TransactionsTable;