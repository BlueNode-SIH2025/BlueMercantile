# BlueMercantile Web3 Integration

## 🌟 Overview

BlueMercantile now features full Web3 integration with MetaMask supporting both local Ganache development and Ethereum Sepolia testnet, enabling real blockchain-based carbon credit token transactions.

## ✨ Features

### 🔗 Wallet Integration
- **MetaMask Connection**: Seamless wallet connection with automatic network detection
- **Network Management**: Automatic Sepolia testnet switching
- **Balance Display**: Real-time ETH and BCT token balance updates
- **Address Management**: Clean address formatting and copy-to-clipboard functionality

### 💰 Token Management
- **BlueCarbonToken (BCT)**: Custom ERC20-compatible token for carbon credits
- **Real-time Balances**: Live token balance updates
- **Transfer Functionality**: Send BCT tokens to any Ethereum address
- **Transaction Validation**: Input validation and insufficient balance checks

### 📊 Transaction Tracking
- **Transaction History**: Complete transaction log with status tracking
- **Etherscan Integration**: Direct links to view transactions on blockchain explorer
- **Status Updates**: Real-time transaction status (pending → confirmed)
- **Gas Fee Estimation**: Clear indication of transaction costs

### 🎯 User Experience
- **Responsive Design**: Works perfectly on desktop and mobile
- **Error Handling**: Comprehensive error messages and troubleshooting
- **Loading States**: Visual feedback during blockchain operations
- **Help Documentation**: Built-in setup guides and feature explanations

## 🏗️ Architecture

### Smart Contract
```solidity
BlueCarbonToken (BCT)
├── ERC20-compatible functions
├── Minting capabilities (owner only)
├── Burning functionality
├── Full transfer support
└── Allowance management
```

### Frontend Components
```
/components
├── WalletConnect.tsx      # MetaMask integration
├── TransferForm.tsx       # Token transfer interface
├── TransactionsTable.tsx  # Transaction history
└── Web3Dashboard.tsx      # Main dashboard wrapper
```

### Technology Stack
- **Blockchain**: Ganache Local / Ethereum Sepolia Testnet
- **Wallet**: MetaMask Browser Extension
- **Web3 Library**: Ethers.js v6
- **Smart Contract**: Solidity 0.8.19
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS

## 🚀 Quick Start

### 🔧 Option 1: Local Development with Ganache (Recommended)

#### 1. Prerequisites
- Node.js and npm installed
- MetaMask browser extension

#### 2. Setup Ganache
```bash
npm install -g ganache-cli
ganache-cli --port 8545 --networkId 1337 --accounts 10 --balance 100
```

#### 3. Configure MetaMask
- **Network Name**: Ganache Local
- **RPC URL**: http://localhost:8545
- **Chain ID**: 1337
- **Currency**: ETH

#### 4. Deploy Contract & Configure
1. Open [Remix IDE](https://remix.ethereum.org/)
2. Use "External HTTP Provider" → http://localhost:8545
3. Deploy BlueCarbonToken contract
4. Run in browser console: `setGanacheConfig('0xYourContractAddress')`

### 🌐 Option 2: Sepolia Testnet

#### 1. Prerequisites
- MetaMask browser extension
- Sepolia testnet ETH (get from faucets)

#### 2. Deploy Contract
1. Open [Remix IDE](https://remix.ethereum.org/)
2. Deploy to Sepolia testnet via MetaMask
3. Copy the deployed contract address

#### 3. Configure Environment
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/
```

### 📚 Detailed Setup Guides
- **Ganache Setup**: See `GANACHE_SETUP_GUIDE.md`
- **Sepolia Setup**: See `WEB3_SETUP_GUIDE.md`

## 📱 User Dashboards

### Patron Dashboard
- **Focus**: Receive BCT for verified plantation activities
- **Features**: Wallet connection, token receiving, balance tracking
- **Use Case**: Farmers, NGOs, Panchayats earning carbon credits

### Credit Client Dashboard  
- **Focus**: Purchase and transfer BCT to support initiatives
- **Features**: Token purchasing, transfer capabilities, impact tracking
- **Use Case**: Companies/individuals buying carbon credits

## 🔧 Advanced Features

### Environment Configuration
```env
# Core Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/...
NEXT_PUBLIC_CHAIN_ID=11155111

# Optional Features
NEXT_PUBLIC_ETHERSCAN_API_KEY=...
NEXT_PUBLIC_OWNER_ADDRESS=0x...
```

### Smart Contract Functions
```javascript
// Core ERC20 Functions
transfer(to, amount)           // Send tokens
balanceOf(account)            // Check balance
approve(spender, amount)      // Approve spending
transferFrom(from, to, amount) // Spend approved tokens

// Administrative Functions
mint(to, amount)              // Create new tokens (owner only)
burn(amount)                  // Destroy tokens
transferOwnership(newOwner)   // Change contract owner
```

### Integration Examples
```javascript
// Connect to wallet
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Create contract instance
const contract = new ethers.Contract(contractAddress, ABI, signer);

// Transfer tokens
const tx = await contract.transfer(recipient, amount);
await tx.wait(); // Wait for confirmation
```

## 🔍 Testing & Verification

### Local Testing
1. Connect to Sepolia testnet
2. Get test ETH from faucets
3. Deploy contract via Remix
4. Test token transfers
5. Verify on Etherscan

### Faucet Resources
- [Sepolia Faucet](https://sepoliafaucet.com/) - 0.5 ETH
- [Chainlink Faucet](https://faucets.chain.link/sepolia) - 0.1 ETH
- [Alchemy Faucet](https://sepoliafaucet.com/) - Various amounts

### Etherscan Integration
- **Sepolia Explorer**: https://sepolia.etherscan.io/
- **Transaction Verification**: Automatic linking to transaction details
- **Contract Verification**: Optional source code publishing

## 🚨 Security & Best Practices

### Security Measures
- ✅ Input validation on all forms
- ✅ Network verification before transactions
- ✅ Balance checks before transfers
- ✅ Error handling for failed transactions
- ✅ Gas estimation and user warnings

### Best Practices
- 🔐 Never store private keys in frontend
- 🌐 Always verify network before operations
- 💰 Check balances before transactions
- ⛽ Ensure sufficient ETH for gas fees
- 🔍 Validate all user inputs

## 📊 Monitoring & Analytics

### Transaction Tracking
- Real-time transaction status updates
- Complete transaction history per wallet
- Gas fee tracking and optimization
- Failed transaction analysis

### Performance Metrics
- Wallet connection success rate
- Transaction completion time
- Network switching efficiency
- User engagement with Web3 features

## 🆘 Troubleshooting

### Common Issues

**MetaMask Not Detected**
```javascript
// Check if MetaMask is installed
if (!window.ethereum) {
  alert('Please install MetaMask');
  window.open('https://metamask.io/download/');
}
```

**Wrong Network**
```javascript
// Auto-switch to Sepolia
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xaa36a7' }], // Sepolia
});
```

**Insufficient Gas**
```javascript
// Check ETH balance before transactions
const balance = await provider.getBalance(address);
if (balance < estimatedGas) {
  alert('Insufficient ETH for gas fees');
}
```

## 🔮 Future Enhancements

### Planned Features
- 🎯 **Carbon Credit Marketplace**: Direct BCT trading
- 📈 **Analytics Dashboard**: Token flow visualization
- 🏆 **Rewards System**: Incentives for active participants
- 🔄 **Cross-chain Support**: Multi-blockchain compatibility
- 📱 **Mobile App**: Native mobile wallet integration

### Technical Improvements
- ⚡ **Layer 2 Integration**: Lower gas fees with Polygon/Arbitrum
- 🔧 **Batch Transactions**: Multiple operations in single transaction
- 📊 **Advanced Analytics**: On-chain data analysis
- 🎨 **Custom Tokens**: User-generated carbon credit tokens

## 📞 Support

For Web3-related issues:
1. Check MetaMask connection
2. Verify Sepolia network
3. Ensure sufficient ETH balance
4. Review transaction on Etherscan
5. Contact support with transaction hash

---

**Ready to revolutionize carbon credits with blockchain technology! 🌱⛓️**