/**
 * Ganache Quick Start Configuration for BlueMercantile
 * This script helps you quickly set up Ganache for local development
 */

// Recommended Ganache configuration
const GANACHE_CONFIG = {
  port: 8545,
  host: '127.0.0.1',
  networkId: 1337,
  chainId: 1337,
  accounts: 10,
  balance: 100, // ETH per account
  gasLimit: 90000000,
  gasPrice: 20000000000, // 20 Gwei
  mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat' // Example mnemonic
};

// CLI command for Ganache
const CLI_COMMAND = `ganache-cli \\
  --port ${GANACHE_CONFIG.port} \\
  --host ${GANACHE_CONFIG.host} \\
  --networkId ${GANACHE_CONFIG.networkId} \\
  --chainId ${GANACHE_CONFIG.chainId} \\
  --accounts ${GANACHE_CONFIG.accounts} \\
  --balance ${GANACHE_CONFIG.balance} \\
  --gasLimit ${GANACHE_CONFIG.gasLimit} \\
  --gasPrice ${GANACHE_CONFIG.gasPrice} \\
  --deterministic \\
  --mnemonic "${GANACHE_CONFIG.mnemonic}"`;

// MetaMask network configuration
const METAMASK_NETWORK = {
  networkName: 'Ganache Local',
  rpcUrl: `http://${GANACHE_CONFIG.host}:${GANACHE_CONFIG.port}`,
  chainId: GANACHE_CONFIG.chainId,
  currencySymbol: 'ETH',
  blockExplorerUrl: '' // Leave empty for local
};

// Default accounts from the mnemonic above (for reference)
const DEFAULT_ACCOUNTS = [
  {
    address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
    privateKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
  },
  {
    address: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
    privateKey: '0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f'
  }
  // ... more accounts available
];

function displaySetupInstructions() {
  console.log(`
🚀 BlueMercantile Ganache Quick Start
=====================================

📋 Prerequisites:
• Node.js installed
• npm or yarn available

🔧 Installation Options:

Option 1 - Ganache CLI (Command Line):
npm install -g ganache-cli

Option 2 - Ganache GUI (Visual Interface):
Download from: https://trufflesuite.com/ganache/

📡 Recommended CLI Command:
${CLI_COMMAND}

🦊 MetaMask Configuration:
Network Name: ${METAMASK_NETWORK.networkName}
RPC URL: ${METAMASK_NETWORK.rpcUrl}
Chain ID: ${METAMASK_NETWORK.chainId}
Currency Symbol: ${METAMASK_NETWORK.currencySymbol}
Block Explorer: (leave empty)

🔑 Test Account (from deterministic mnemonic):
Address: ${DEFAULT_ACCOUNTS[0].address}
Private Key: ${DEFAULT_ACCOUNTS[0].privateKey}

⚠️  WARNING: Never use these keys on mainnet or with real funds!

🎯 Quick Setup Steps:
1. Run the Ganache CLI command above
2. Add the network to MetaMask with the configuration above
3. Import the test account private key into MetaMask
4. Deploy your contract using Remix with "External HTTP Provider"
5. Use setGanacheConfig('0xYourContractAddress') in browser console

📚 Full Guide: See GANACHE_SETUP_GUIDE.md for detailed instructions
  `);
}

function generateGanacheCommand(customOptions = {}) {
  const config = { ...GANACHE_CONFIG, ...customOptions };
  
  return `ganache-cli \\
  --port ${config.port} \\
  --host ${config.host} \\
  --networkId ${config.networkId} \\
  --chainId ${config.chainId} \\
  --accounts ${config.accounts} \\
  --balance ${config.balance} \\
  --gasLimit ${config.gasLimit} \\
  --gasPrice ${config.gasPrice} \\
  --deterministic \\
  --mnemonic "${config.mnemonic}"`;
}

function getMetaMaskConfig(host = '127.0.0.1', port = 8545) {
  return {
    networkName: 'Ganache Local',
    rpcUrl: `http://${host}:${port}`,
    chainId: 1337,
    currencySymbol: 'ETH',
    blockExplorerUrl: ''
  };
}

// Make functions available globally for browser console
if (typeof window !== 'undefined') {
  window.ganacheQuickStart = {
    displaySetupInstructions,
    generateGanacheCommand,
    getMetaMaskConfig,
    GANACHE_CONFIG,
    DEFAULT_ACCOUNTS
  };
  
  // Auto-display instructions
  displaySetupInstructions();
}

export {
  displaySetupInstructions,
  generateGanacheCommand,
  getMetaMaskConfig,
  GANACHE_CONFIG,
  DEFAULT_ACCOUNTS
};