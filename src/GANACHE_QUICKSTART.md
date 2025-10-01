# 🚀 Ganache Quick Start for BlueMercantile

## Overview

This guide will get you up and running with Ganache local blockchain for BlueMercantile Web3 development in under 10 minutes.

## Prerequisites

- Node.js installed
- MetaMask browser extension

## Step 1: Install and Start Ganache

### Option A: Ganache CLI (Recommended)
```bash
npm install -g ganache-cli
ganache-cli --port 8545 --networkId 1337 --accounts 10 --balance 100
```

### Option B: Ganache GUI
1. Download from [trufflesuite.com/ganache](https://trufflesuite.com/ganache/)
2. Install and run
3. Create new workspace with these settings:
   - Port: 8545
   - Network ID: 1337
   - Accounts: 10
   - Balance: 100 ETH each

## Step 2: Configure MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter these details:
   ```
   Network Name: Ganache Local
   RPC URL: http://localhost:8545
   Chain ID: 1337
   Currency Symbol: ETH
   ```
4. Save and switch to "Ganache Local" network

## Step 3: Import Test Account

1. In Ganache, copy any account's private key (click key icon)
2. In MetaMask: Account menu → "Import Account" → paste private key
3. You should see 100 ETH balance

## Step 4: Deploy Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `BlueCarbonToken.sol`
3. Copy contract code from `/contracts/BlueCarbonToken.sol`
4. Compile with Solidity 0.8.19+
5. Deploy tab → "External HTTP Provider" → `http://localhost:8545`
6. Deploy the contract
7. **Copy the deployed contract address**

## Step 5: Configure BlueMercantile

1. Open BlueMercantile in your browser
2. Press F12 → Console tab
3. Run this command (replace with your contract address):
   ```javascript
   setGanacheConfig('0xYOUR_CONTRACT_ADDRESS_HERE')
   ```
4. Refresh the page

## Step 6: Test the Integration

1. Login to BlueMercantile (patron: ptrn1001/temp123 or client: crdcl1001/temp456)
2. Go to dashboard
3. Click "Connect Wallet" → approve MetaMask connection
4. You should see:
   - Connected to Ganache Local
   - Your ETH balance (100 ETH)
   - BCT token balance (1M tokens for contract deployer)

## Step 7: Test Token Transfer

1. In the token transfer section:
2. Enter recipient address (another Ganache address)
3. Enter amount (e.g., 100 BCT)
4. Click "Transfer Tokens"
5. Transaction completes instantly!

## 🎉 Success!

You now have a fully functional local blockchain setup for BlueMercantile development.

## Quick Commands Reference

```javascript
// View current configuration
getCurrentConfig()

// Set new contract address for Ganache
setGanacheConfig('0xNEW_CONTRACT_ADDRESS')

// Switch to Sepolia later
setSepoliaConfig('0xCONTRAC_ADDRESS', 'https://sepolia.infura.io/v3/YOUR_KEY')

// Clear all configuration
clearContractAddress()
```

## Benefits of Ganache Development

✅ **Instant transactions** - No waiting for block confirmations  
✅ **Free gas** - No real ETH required  
✅ **Full control** - Reset blockchain anytime  
✅ **Offline development** - No internet required  
✅ **Predictable addresses** - Same accounts every restart  
✅ **Fast iteration** - Deploy and test quickly  

## Troubleshooting

**MetaMask can't connect?**
- Ensure Ganache is running on port 8545
- Check that RPC URL is exactly `http://localhost:8545`

**Transaction fails?**
- Make sure you're on Ganache Local network in MetaMask
- Verify you have ETH for gas fees

**Contract not found?**
- Double-check contract address in `setGanacheConfig()`
- Ensure contract was deployed successfully in Remix

## Need Help?

- See full setup guide: `GANACHE_SETUP_GUIDE.md`
- Check Web3 documentation: `WEB3_README.md`
- View contract code: `/contracts/BlueCarbonToken.sol`

---

**Happy local blockchain development! 🔗⚡**