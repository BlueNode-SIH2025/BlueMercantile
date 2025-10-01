/**
 * Web3 Configuration Helper Component
 * Provides runtime configuration for Ganache and testnet deployment
 */

import { useEffect } from 'react';

declare global {
  interface Window {
    setContractAddress: (address: string) => boolean;
    getContractAddress: () => string;
    clearContractAddress: () => void;
    setGanacheConfig: (contractAddress: string) => boolean;
    setSepoliaConfig: (contractAddress: string, rpcUrl?: string) => boolean;
    getCurrentConfig: () => any;
    ENV?: any;
  }
}

export function Web3ConfigHelper() {
  useEffect(() => {
    // Set contract address function
    window.setContractAddress = function(address: string): boolean {
      if (!address || !address.startsWith('0x') || address.length !== 42) {
        console.error('❌ Invalid contract address. Please provide a valid Ethereum address starting with 0x');
        return false;
      }
      
      // Store in window object for current session
      if (!window.ENV) {
        window.ENV = {};
      }
      
      window.ENV.NEXT_PUBLIC_CONTRACT_ADDRESS = address;
      
      // Store in localStorage for persistence
      localStorage.setItem('BLUEMERCANTILE_CONTRACT_ADDRESS', address);
      
      console.log('✅ Contract address set successfully:', address);
      console.log('🔄 Please refresh the page to apply changes');
      
      return true;
    };

    // Get contract address function
    window.getContractAddress = function(): string {
      const windowAddress = window.ENV?.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const storedAddress = localStorage.getItem('BLUEMERCANTILE_CONTRACT_ADDRESS');
      
      const address = windowAddress || storedAddress;
      
      if (address) {
        console.log('📍 Current contract address:', address);
        return address;
      } else {
        console.log('⚠️  No contract address set. Using demo address.');
        return '0x1234567890123456789012345678901234567890';
      }
    };

    // Set Ganache configuration function
    window.setGanacheConfig = function(contractAddress: string): boolean {
      if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.length !== 42) {
        console.error('❌ Invalid contract address. Please provide a valid Ethereum address starting with 0x');
        return false;
      }
      
      if (!window.ENV) {
        window.ENV = {};
      }
      
      // Set Ganache configuration
      window.ENV.NEXT_PUBLIC_CONTRACT_ADDRESS = contractAddress;
      window.ENV.NEXT_PUBLIC_RPC_URL = 'http://localhost:8545';
      window.ENV.NEXT_PUBLIC_CHAIN_ID = '1337';
      window.ENV.NEXT_PUBLIC_NETWORK_NAME = 'Ganache Local';
      
      // Store in localStorage for persistence
      localStorage.setItem('BLUEMERCANTILE_CONTRACT_ADDRESS', contractAddress);
      localStorage.setItem('BLUEMERCANTILE_RPC_URL', 'http://localhost:8545');
      localStorage.setItem('BLUEMERCANTILE_CHAIN_ID', '1337');
      localStorage.setItem('BLUEMERCANTILE_NETWORK_NAME', 'Ganache Local');
      
      console.log('✅ Ganache configuration set successfully:');
      console.log('📍 Contract Address:', contractAddress);
      console.log('🌐 RPC URL: http://localhost:8545');
      console.log('🔗 Chain ID: 1337');
      console.log('📡 Network: Ganache Local');
      console.log('🔄 Please refresh the page to apply changes');
      
      return true;
    };

    // Set Sepolia configuration function
    window.setSepoliaConfig = function(contractAddress: string, rpcUrl?: string): boolean {
      if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.length !== 42) {
        console.error('❌ Invalid contract address. Please provide a valid Ethereum address starting with 0x');
        return false;
      }
      
      if (!window.ENV) {
        window.ENV = {};
      }
      
      const sepoliaRpc = rpcUrl || 'https://sepolia.infura.io/v3/';
      
      // Set Sepolia configuration
      window.ENV.NEXT_PUBLIC_CONTRACT_ADDRESS = contractAddress;
      window.ENV.NEXT_PUBLIC_RPC_URL = sepoliaRpc;
      window.ENV.NEXT_PUBLIC_CHAIN_ID = '11155111';
      window.ENV.NEXT_PUBLIC_NETWORK_NAME = 'Sepolia Test Network';
      
      // Store in localStorage for persistence
      localStorage.setItem('BLUEMERCANTILE_CONTRACT_ADDRESS', contractAddress);
      localStorage.setItem('BLUEMERCANTILE_RPC_URL', sepoliaRpc);
      localStorage.setItem('BLUEMERCANTILE_CHAIN_ID', '11155111');
      localStorage.setItem('BLUEMERCANTILE_NETWORK_NAME', 'Sepolia Test Network');
      
      console.log('✅ Sepolia configuration set successfully:');
      console.log('📍 Contract Address:', contractAddress);
      console.log('🌐 RPC URL:', sepoliaRpc);
      console.log('🔗 Chain ID: 11155111');
      console.log('📡 Network: Sepolia Test Network');
      console.log('🔄 Please refresh the page to apply changes');
      
      return true;
    };

    // Clear configuration function
    window.clearContractAddress = function(): void {
      if (window.ENV) {
        delete window.ENV.NEXT_PUBLIC_CONTRACT_ADDRESS;
        delete window.ENV.NEXT_PUBLIC_RPC_URL;
        delete window.ENV.NEXT_PUBLIC_CHAIN_ID;
        delete window.ENV.NEXT_PUBLIC_NETWORK_NAME;
      }
      localStorage.removeItem('BLUEMERCANTILE_CONTRACT_ADDRESS');
      localStorage.removeItem('BLUEMERCANTILE_RPC_URL');
      localStorage.removeItem('BLUEMERCANTILE_CHAIN_ID');
      localStorage.removeItem('BLUEMERCANTILE_NETWORK_NAME');
      console.log('🗑️  All configuration cleared. Using default Ganache settings.');
      console.log('🔄 Please refresh the page to apply changes');
    };

    // Get current configuration function
    window.getCurrentConfig = function(): any {
      const config = {
        contractAddress: window.ENV?.NEXT_PUBLIC_CONTRACT_ADDRESS || localStorage.getItem('BLUEMERCANTILE_CONTRACT_ADDRESS'),
        rpcUrl: window.ENV?.NEXT_PUBLIC_RPC_URL || localStorage.getItem('BLUEMERCANTILE_RPC_URL'),
        chainId: window.ENV?.NEXT_PUBLIC_CHAIN_ID || localStorage.getItem('BLUEMERCANTILE_CHAIN_ID'),
        networkName: window.ENV?.NEXT_PUBLIC_NETWORK_NAME || localStorage.getItem('BLUEMERCANTILE_NETWORK_NAME')
      };
      
      console.log('📊 Current Configuration:');
      console.log('📍 Contract Address:', config.contractAddress || 'Default demo address');
      console.log('🌐 RPC URL:', config.rpcUrl || 'Default Ganache (http://localhost:8545)');
      console.log('🔗 Chain ID:', config.chainId || 'Default Ganache (1337)');
      console.log('📡 Network:', config.networkName || 'Default Ganache Local');
      
      return config;
    };

    // Load from localStorage on startup
    const storedAddress = localStorage.getItem('BLUEMERCANTILE_CONTRACT_ADDRESS');
    const storedRpcUrl = localStorage.getItem('BLUEMERCANTILE_RPC_URL');
    const storedChainId = localStorage.getItem('BLUEMERCANTILE_CHAIN_ID');
    const storedNetworkName = localStorage.getItem('BLUEMERCANTILE_NETWORK_NAME');
    
    if (storedAddress || storedRpcUrl || storedChainId || storedNetworkName) {
      if (!window.ENV) {
        window.ENV = {};
      }
      if (storedAddress) window.ENV.NEXT_PUBLIC_CONTRACT_ADDRESS = storedAddress;
      if (storedRpcUrl) window.ENV.NEXT_PUBLIC_RPC_URL = storedRpcUrl;
      if (storedChainId) window.ENV.NEXT_PUBLIC_CHAIN_ID = storedChainId;
      if (storedNetworkName) window.ENV.NEXT_PUBLIC_NETWORK_NAME = storedNetworkName;
    }

    // Display help message
    console.log(`
🌍 BlueMercantile Web3 Configuration Helper

Available commands:
• setGanacheConfig('0x...') - Configure for Ganache local development
• setSepoliaConfig('0x...', 'rpcUrl') - Configure for Sepolia testnet
• setContractAddress('0x...') - Set contract address only
• getContractAddress() - View current contract address  
• getCurrentConfig() - View all current settings
• clearContractAddress() - Reset to default mode

🔨 Quick Setup Examples:

For Ganache local development:
setGanacheConfig('0x742d35cc6651c80b4e4c2d2e4f4d2e4f4d2e4f4d')

For Sepolia testnet:
setSepoliaConfig('0x742d35cc6651c80b4e4c2d2e4f4d2e4f4d2e4f4d', 'https://sepolia.infura.io/v3/YOUR_KEY')
    `);

  }, []);

  return null; // This component doesn't render anything
}

export default Web3ConfigHelper;