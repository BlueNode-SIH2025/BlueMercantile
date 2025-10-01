# BlueMercantile Web3 Integration Setup Guide

## 🚀 Complete Step-by-Step Setup

This guide will take you from zero to a fully functional Web3-enabled BlueMercantile platform running on Sepolia testnet.

---

## 📋 Prerequisites

1. **MetaMask Browser Extension**
2. **Basic understanding of blockchain concepts**
3. **Access to Figma Make environment**

---

## 🏗️ Part 1: Environment Setup

### Step 1: Install MetaMask

1. Go to [metamask.io/download](https://metamask.io/download/)
2. Install the browser extension for your browser
3. Create a new wallet or import existing one
4. **IMPORTANT**: Save your seed phrase securely!

### Step 2: Add Sepolia Testnet to MetaMask

1. Open MetaMask
2. Click the network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network"
4. Enter these details:
   ```
   Network Name: Sepolia Test Network
   New RPC URL: https://sepolia.infura.io/v3/
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer URL: https://sepolia.etherscan.io/
   ```
5. Click "Save"

### Step 3: Get Sepolia Test ETH

You need Sepolia ETH for:
- Deploying the smart contract
- Paying gas fees for transactions

**Recommended Faucets:**
1. **Sepolia Faucet**: https://sepoliafaucet.com/
   - Requires Twitter/GitHub account
   - Gives 0.5 ETH per request

2. **Chainlink Faucet**: https://faucets.chain.link/sepolia
   - Requires Twitter account
   - Gives 0.1 ETH per request

3. **Alchemy Faucet**: https://sepoliafaucet.com/
   - No social media required
   - Lower amounts but reliable

**How to use faucets:**
1. Copy your MetaMask wallet address
2. Paste it into the faucet
3. Complete any verification (Twitter, etc.)
4. Wait for the transaction to complete (usually 1-2 minutes)

---

## 💰 Part 2: Smart Contract Deployment

### Step 1: Open Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org/)
2. Create a new workspace or use the default

### Step 2: Create the Contract File

1. In the file explorer, create a new file: `BlueCarbonToken.sol`
2. Copy the entire contract code from `/contracts/BlueCarbonToken.sol`
3. Paste it into the new file

### Step 3: Compile the Contract

1. Go to the "Solidity Compiler" tab (📋 icon)
2. Select compiler version `0.8.19` or higher
3. Click "Compile BlueCarbonToken.sol"
4. Make sure there are no errors (green checkmark should appear)

### Step 4: Deploy to Sepolia

1. Go to "Deploy & Run Transactions" tab (🚀 icon)
2. **Environment**: Select "Injected Provider - MetaMask"
3. **Important**: Ensure MetaMask is set to Sepolia testnet
4. **Account**: Your MetaMask account should appear
5. **Contract**: Select "BlueCarbonToken"
6. Click "Deploy"
7. **MetaMask will popup**: Review the transaction and click "Confirm"
8. Wait for deployment (usually 15-30 seconds)

### Step 5: Verify Deployment

1. Once deployed, you'll see the contract in the "Deployed Contracts" section
2. **Copy the contract address** (looks like: 0x1234...abcd)
3. Click on the contract to expand its functions
4. Test it by clicking "totalSupply" - should show 1000000000000000000000000 (1M tokens with 18 decimals)

### Step 6: View on Etherscan

1. Go to [sepolia.etherscan.io](https://sepolia.etherscan.io/)
2. Paste your contract address in the search bar
3. You should see your contract with the deployment transaction

---

## ⚙️ Part 3: Frontend Configuration

### Step 1: Update Environment Variables

In your Figma Make environment, create these environment variables:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=Sepolia Test Network
```

**To set environment variables in Figma Make:**
1. Go to your project settings
2. Find "Environment Variables" section
3. Add each variable with its value
4. Save the changes

### Step 2: Install Required Dependencies

The following dependencies are already included in the project:
- `ethers` - For blockchain interactions
- Web3 modal components
- MetaMask detection

---

## 🎯 Part 4: Testing the Integration

### Step 1: Test Wallet Connection

1. Run your Figma Make project
2. Register as a patron or credit client
3. Login to your dashboard
4. Click "Connect Wallet" button
5. MetaMask should popup asking for connection permission
6. Approve the connection
7. If not on Sepolia, click "Switch Network" button

### Step 2: Test Token Balance

1. Once wallet is connected, you should see:
   - Your wallet address
   - ETH balance
   - BCT token balance (should be 1M if you're the deployer)

### Step 3: Test Token Transfer

1. In the "Transfer BlueCarbonTokens" section:
2. Enter a recipient address (you can use another wallet address)
3. Enter an amount (try 100 BCT)
4. Click "Transfer Tokens"
5. MetaMask will popup for transaction confirmation
6. Confirm the transaction
7. Wait for confirmation (usually 15-30 seconds)

### Step 4: Test Transaction History

1. After making a transfer, check the "Recent Transactions" table
2. You should see your transaction with:
   - Transaction hash
   - From/To addresses
   - Amount transferred
   - Status (pending → success)
   - Timestamp

---

## 🔧 Part 5: Advanced Configuration

### Optional: Get Alchemy/Infura RPC URL

For better performance, you can use a dedicated RPC endpoint:

1. **Alchemy** (Recommended):
   - Go to [alchemy.com](https://www.alchemy.com/)
   - Create free account
   - Create new app for "Ethereum" → "Sepolia"
   - Copy the HTTPS URL
   - Update `NEXT_PUBLIC_RPC_URL`

2. **Infura**:
   - Go to [infura.io](https://infura.io/)
   - Create free account
   - Create new project
   - Select Ethereum → Sepolia
   - Copy the HTTPS endpoint

### Optional: Contract Verification

To make your contract source code public:

1. Go to [sepolia.etherscan.io](https://sepolia.etherscan.io/)
2. Find your contract
3. Click "Contract" tab
4. Click "Verify and Publish"
5. Select "Solidity (Single file)"
6. Upload your contract code
7. Set compiler version to match Remix (0.8.19)
8. Submit for verification

---

## 🚨 Troubleshooting

### Common Issues:

**1. MetaMask not detected**
- Refresh the page
- Make sure MetaMask extension is enabled
- Try in incognito/private mode

**2. Wrong network error**
- Click "Switch Network" button in the dashboard
- Or manually switch in MetaMask

**3. Insufficient funds for gas**
- Get more Sepolia ETH from faucets
- Gas fees typically cost 0.0001-0.001 ETH

**4. Transaction fails**
- Check if you have enough tokens
- Verify recipient address is valid
- Ensure you have ETH for gas fees

**5. Contract address not working**
- Double-check the address in environment variables
- Verify contract is deployed on Sepolia
- Check Etherscan for contract status

**6. Token balance shows 0**
- Make sure you're connected to the deployer address
- Check if contract deployment was successful
- Try refreshing the balance

---

## 🎉 Success Criteria

You've successfully set up the Web3 integration when:

✅ MetaMask connects to your dApp  
✅ Network switches to Sepolia automatically  
✅ Token balance displays correctly  
✅ Transfers work and show in transaction history  
✅ All transactions appear on Sepolia Etherscan  

---

## 📚 Additional Resources

- **MetaMask Documentation**: https://docs.metamask.io/
- **Remix IDE Tutorials**: https://remix-ide.readthedocs.io/
- **Ethers.js Documentation**: https://docs.ethers.org/
- **Sepolia Faucets**: https://sepoliafaucet.com/
- **Etherscan Sepolia**: https://sepolia.etherscan.io/

---

## 🆘 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure you have sufficient Sepolia ETH
4. Try with a fresh MetaMask account for testing

---

## 🔐 Security Notes

- **Never share your MetaMask seed phrase**
- **This is testnet only** - no real value involved
- **Always verify contract addresses** before interacting
- **Test with small amounts first**

---

**Congratulations! You now have a fully functional Web3-enabled carbon credit platform! 🎊**