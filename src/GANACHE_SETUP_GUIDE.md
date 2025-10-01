# BlueMercantile Ganache Local Blockchain Setup Guide

## 🚀 Complete Local Development Setup

This guide will help you set up a local blockchain environment using Ganache for BlueMercantile development. This is ideal for development, testing, and demo purposes.

---

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **MetaMask Browser Extension**
3. **Basic understanding of blockchain concepts**

---

## 🏗️ Part 1: Ganache Setup

### Step 1: Install Ganache

Choose one of these options:

#### Option A: Ganache GUI (Recommended for beginners)
1. Go to [trufflesuite.com/ganache](https://trufflesuite.com/ganache/)
2. Download Ganache for your operating system
3. Install and launch the application

#### Option B: Ganache CLI (For developers)
```bash
npm install -g ganache-cli
```

### Step 2: Configure Ganache

#### For Ganache GUI:
1. Launch Ganache
2. Click "New Workspace" 
3. Configure these settings:
   ```
   Server Tab:
   - Hostname: 127.0.0.1
   - Port Number: 8545
   - Network ID: 1337
   - Automine: ON
   
   Accounts & Keys Tab:
   - Account Default Balance: 100 ETH
   - Total Accounts to Generate: 10
   - Autogenerate HD Mnemonic: ON (or use your custom mnemonic)
   ```
4. Click "Save Workspace"

#### For Ganache CLI:
```bash
ganache-cli --port 8545 --networkId 1337 --accounts 10 --balance 100 --host 0.0.0.0
```

### Step 3: Verify Ganache is Running

You should see:
- 10 accounts with 100 ETH each
- RPC Server running at http://127.0.0.1:8545
- Network ID: 1337

---

## 🦊 Part 2: MetaMask Configuration

### Step 1: Add Ganache Network to MetaMask

1. Open MetaMask
2. Click the network dropdown
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   ```
   Network Name: Ganache Local
   New RPC URL: http://localhost:8545
   Chain ID: 1337
   Currency Symbol: ETH
   Block Explorer URL: (leave blank)
   ```
5. Click "Save"
6. Switch to the "Ganache Local" network

### Step 2: Import Ganache Account

1. In Ganache, copy the private key of any account (click the key icon)
2. In MetaMask, click the account circle → "Import Account"
3. Select "Private Key"
4. Paste the private key
5. Click "Import"

**⚠️ Important**: Never use Ganache private keys on mainnet or real testnets!

---

## 💰 Part 3: Smart Contract Deployment

### Step 1: Open Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org/)
2. Create a new workspace

### Step 2: Create and Compile Contract

1. Create new file: `BlueCarbonToken.sol`
2. Copy the contract code from `/contracts/BlueCarbonToken.sol`
3. Go to "Solidity Compiler" tab
4. Select compiler version `0.8.19` or higher
5. Click "Compile BlueCarbonToken.sol"

### Step 3: Deploy to Ganache

1. Go to "Deploy & Run Transactions" tab
2. **Environment**: Select "External Http Provider"
3. **External Http Provider Endpoint**: Enter `http://localhost:8545`
4. Click "OK" to connect
5. **Account**: Should show your Ganache accounts
6. **Contract**: Select "BlueCarbonToken"
7. Click "Deploy"
8. Contract deploys instantly (no waiting for miners!)

### Step 4: Copy Contract Address

1. In the "Deployed Contracts" section, copy the contract address
2. Save this address - you'll need it for frontend configuration

---

## ⚙️ Part 4: Frontend Configuration

### Step 1: Update Environment Configuration

In your BlueMercantile project, set these configurations:

```javascript
// These can be set as environment variables or directly in Web3Config.tsx
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_NETWORK_NAME=Ganache Local
```

### Step 2: Alternative Configuration Methods

#### Method A: Environment Variables (if supported)
Create `.env.local` file:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_NETWORK_NAME=Ganache Local
```

#### Method B: Direct Configuration
Update `/components/Web3Config.tsx`:
```javascript
export const Web3Config = {
  CONTRACT_ADDRESS: '0xYOUR_DEPLOYED_CONTRACT_ADDRESS',
  // ... other configs are already set for Ganache
};
```

#### Method C: Runtime Configuration
Use localStorage to set contract address:
```javascript
localStorage.setItem('BLUEMERCANTILE_CONTRACT_ADDRESS', '0xYOUR_DEPLOYED_CONTRACT_ADDRESS');
```

---

## 🎯 Part 5: Testing the Integration

### Step 1: Test Wallet Connection

1. Run your BlueMercantile application
2. Register and login as patron or credit client
3. Go to dashboard
4. Click "Connect Wallet"
5. MetaMask should connect to Ganache Local network
6. You should see your account with 100 ETH

### Step 2: Test Token Functions

1. **Check Token Balance**: Should show 1,000,000 BCT for deployer account
2. **Transfer Tokens**: 
   - Enter another Ganache address as recipient
   - Transfer some tokens
   - Transaction should complete instantly
3. **View Transaction History**: Should show your transfers immediately

### Step 3: Verify in Ganache

1. In Ganache GUI, go to "Transactions" tab
2. You should see all your contract interactions
3. Gas costs are minimal for testing

---

## 🔄 Part 6: Development Workflow

### Quick Reset Process

When you need to reset your environment:

1. **Reset Ganache**: 
   - GUI: Click the restart button
   - CLI: Stop and restart ganache-cli

2. **Redeploy Contract**: 
   - Use Remix to deploy again
   - Update contract address in your config

3. **Reset MetaMask**: 
   - Settings → Advanced → Reset Account
   - This clears transaction history

### Multiple Accounts Testing

1. Import multiple Ganache accounts into MetaMask
2. Test transfers between different accounts
3. Simulate different user roles (patrons, clients, admins)

### Fast Development Cycle

Benefits of Ganache for development:
- ✅ Instant transactions (no waiting)
- ✅ Free gas costs
- ✅ Full control over blockchain state
- ✅ Easy reset and restart
- ✅ No external dependencies
- ✅ Works offline

---

## 🔧 Part 7: Advanced Configuration

### Custom Gas Settings

In Ganache GUI, go to "Chain" tab:
```
Gas Limit: 90000000
Gas Price: 20000000000 (20 Gwei)
```

### Mnemonic Management

For consistent testing, save your Ganache mnemonic:
1. In Ganache, go to "Accounts & Keys" tab
2. Copy the mnemonic phrase
3. Use this same mnemonic for consistent account addresses

### Network Settings

For team development, run Ganache on a shared network:
```bash
ganache-cli --host 0.0.0.0 --port 8545 --networkId 1337
```
Then team members can connect using your IP address.

---

## 🚨 Troubleshooting

### Common Issues:

**1. MetaMask can't connect to Ganache**
- Ensure Ganache is running on port 8545
- Check if localhost:8545 is accessible
- Try restarting both MetaMask and Ganache

**2. Transaction fails**
- Check if you have enough ETH for gas
- Ensure you're on the correct account
- Try resetting MetaMask account

**3. Contract not found**
- Verify contract address is correct
- Ensure contract is deployed to the same network
- Check Ganache "Contracts" tab for deployed contracts

**4. Balance shows 0 tokens**
- Ensure you're using the contract deployer account
- Check if contract deployment was successful
- Verify contract address in configuration

**5. RPC connection errors**
- Ensure Ganache RPC URL is http://localhost:8545
- Check firewall settings
- Try http://127.0.0.1:8545 instead

### Debug Steps:

1. **Check Ganache Console**: Look for errors or warnings
2. **MetaMask Console**: F12 → Console tab for errors
3. **Network Tab**: Check if RPC requests are reaching Ganache
4. **Ganache Logs**: Monitor transaction logs in real-time

---

## 🎉 Success Criteria

You've successfully set up Ganache when:

✅ Ganache blockchain is running on localhost:8545  
✅ MetaMask connects to Ganache Local network  
✅ You can import Ganache accounts into MetaMask  
✅ Smart contract deploys successfully  
✅ Token transfers work instantly  
✅ Transaction history shows in both MetaMask and Ganache  

---

## 📚 Additional Resources

- **Ganache Documentation**: https://trufflesuite.com/docs/ganache/
- **Truffle Suite**: https://trufflesuite.com/
- **MetaMask Developer Docs**: https://docs.metamask.io/
- **Remix IDE**: https://remix-ide.readthedocs.io/
- **Web3 Development**: https://web3.js.org/

---

## 🔄 Switching Between Ganache and Testnets

To switch back to Sepolia or other testnets later:

1. Update Web3Config.tsx:
   ```javascript
   // Change these values:
   getChainId(): '0xaa36a7' // for Sepolia
   getRpcUrl(): 'https://sepolia.infura.io/v3/YOUR_KEY'
   getNetworkName(): 'Sepolia Test Network'
   ```

2. Update contract address to testnet deployment
3. Switch MetaMask to the appropriate network
4. Get testnet ETH from faucets

---

## 🔐 Security Notes

- **Ganache is for development only** - never use on mainnet
- **Private keys are visible** - don't use real funds
- **No real value** - all ETH and tokens are for testing
- **Local only** - blockchain state is not persistent by default

---

**Happy Local Development! 🎊**

You now have a complete local blockchain environment for rapid BlueMercantile development and testing!