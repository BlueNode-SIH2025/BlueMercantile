// Web3 Configuration utility for handling environment variables safely
export const Web3Config = {
  // Contract address - replace with your deployed contract address
  CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
  
  // Ganache local blockchain configuration (Primary)
  GANACHE_CHAIN_ID: '0x539', // 1337 in hex
  GANACHE_RPC_URL: 'http://localhost:8545',
  
  // Sepolia testnet configuration (Backup)
  SEPOLIA_CHAIN_ID: '0xaa36a7', // 11155111 in hex
  SEPOLIA_RPC_URL: 'https://sepolia.infura.io/v3/',
  
  // Network details (defaults to Ganache)
  NETWORK_NAME: 'Ganache Local',
  NATIVE_CURRENCY: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  
  // Block explorer (empty for local development)
  BLOCK_EXPLORER_URL: '',
  
  // Get contract address with fallback
  getContractAddress(): string {
    if (typeof window !== 'undefined') {
      // Try to get from window object if set by environment
      const envContractAddress = (window as any).ENV?.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (envContractAddress && envContractAddress !== this.CONTRACT_ADDRESS) {
        return envContractAddress;
      }
      
      // Try to get from localStorage
      const storedAddress = localStorage.getItem('BLUEMERCANTILE_CONTRACT_ADDRESS');
      if (storedAddress && storedAddress !== this.CONTRACT_ADDRESS) {
        return storedAddress;
      }
    }
    
    // Return default/demo address
    return this.CONTRACT_ADDRESS;
  },
  
  // Get RPC URL with fallback
  getRpcUrl(): string {
    if (typeof window !== 'undefined') {
      // Check window environment first
      const envRpcUrl = (window as any).ENV?.NEXT_PUBLIC_RPC_URL;
      if (envRpcUrl) {
        return envRpcUrl;
      }
      
      // Check localStorage
      const storedRpcUrl = localStorage.getItem('BLUEMERCANTILE_RPC_URL');
      if (storedRpcUrl) {
        return storedRpcUrl;
      }
    }
    
    return this.GANACHE_RPC_URL;
  },
  
  // Get Chain ID with fallback
  getChainId(): string {
    if (typeof window !== 'undefined') {
      // Check window environment first
      const envChainId = (window as any).ENV?.NEXT_PUBLIC_CHAIN_ID;
      if (envChainId) {
        return typeof envChainId === 'string' ? envChainId : `0x${envChainId.toString(16)}`;
      }
      
      // Check localStorage
      const storedChainId = localStorage.getItem('BLUEMERCANTILE_CHAIN_ID');
      if (storedChainId) {
        return typeof storedChainId === 'string' && storedChainId.startsWith('0x') 
          ? storedChainId 
          : `0x${parseInt(storedChainId).toString(16)}`;
      }
    }
    
    return this.GANACHE_CHAIN_ID;
  },
  
  // Get Network Name with fallback
  getNetworkName(): string {
    if (typeof window !== 'undefined') {
      // Check window environment first
      const envNetworkName = (window as any).ENV?.NEXT_PUBLIC_NETWORK_NAME;
      if (envNetworkName) {
        return envNetworkName;
      }
      
      // Check localStorage
      const storedNetworkName = localStorage.getItem('BLUEMERCANTILE_NETWORK_NAME');
      if (storedNetworkName) {
        return storedNetworkName;
      }
    }
    
    return this.NETWORK_NAME;
  },
  
  // Check if using Ganache (local development)
  isGanache(): boolean {
    return this.getChainId() === this.GANACHE_CHAIN_ID;
  },
  
  // Check if using Sepolia testnet
  isSepolia(): boolean {
    return this.getChainId() === this.SEPOLIA_CHAIN_ID;
  },
  
  // Check if we're in demo mode (using default addresses)
  isDemoMode(): boolean {
    return this.getContractAddress() === this.CONTRACT_ADDRESS;
  }
};

export default Web3Config;