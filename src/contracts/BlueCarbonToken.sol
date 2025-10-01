// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BlueCarbonToken
 * @dev Simple ERC20-like token for BlueMercantile carbon credit platform
 * This contract implements basic token functionality for the carbon credit ecosystem
 */
contract BlueCarbonToken {
    // Token metadata
    string public name = "BlueCarbonToken";
    string public symbol = "BCT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    // Mappings
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    // Contract owner
    address public owner;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
    
    /**
     * @dev Constructor that sets the initial supply and assigns it to the deployer
     */
    constructor() {
        owner = msg.sender;
        
        // Mint initial supply of 1,000,000 BCT to the deployer
        uint256 initialSupply = 1000000 * 10**decimals;
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        
        emit Transfer(address(0), msg.sender, initialSupply);
        emit Mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Transfer tokens from the caller to another address
     * @param to The address to transfer tokens to
     * @param amount The amount of tokens to transfer
     * @return success Whether the transfer was successful
     */
    function transfer(address to, uint256 amount) public returns (bool success) {
        require(to != address(0), "Cannot transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    /**
     * @dev Approve another address to spend tokens on behalf of the caller
     * @param spender The address authorized to spend
     * @param amount The maximum amount they can spend
     * @return success Whether the approval was successful
     */
    function approve(address spender, uint256 amount) public returns (bool success) {
        require(spender != address(0), "Cannot approve zero address");
        
        allowance[msg.sender][spender] = amount;
        
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    /**
     * @dev Transfer tokens from one address to another using allowance
     * @param from The address to transfer tokens from
     * @param to The address to transfer tokens to
     * @param amount The amount of tokens to transfer
     * @return success Whether the transfer was successful
     */
    function transferFrom(address from, address to, uint256 amount) public returns (bool success) {
        require(from != address(0), "Cannot transfer from zero address");
        require(to != address(0), "Cannot transfer to zero address");
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        
        totalSupply += amount;
        balanceOf[to] += amount;
        
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
    }
    
    /**
     * @dev Burn tokens from the caller's balance
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance to burn");
        
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        
        emit Transfer(msg.sender, address(0), amount);
        emit Burn(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from another address (requires allowance)
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) public {
        require(from != address(0), "Cannot burn from zero address");
        require(balanceOf[from] >= amount, "Insufficient balance to burn");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        totalSupply -= amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, address(0), amount);
        emit Burn(from, amount);
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
    
    /**
     * @dev Emergency function to recover any ERC20 tokens sent to this contract
     * @param tokenAddress The address of the token to recover
     * @param amount The amount of tokens to recover
     */
    function recoverTokens(address tokenAddress, uint256 amount) public onlyOwner {
        require(tokenAddress != address(this), "Cannot recover BCT tokens");
        
        // This would require importing IERC20 interface in a full implementation
        // For simplicity, we're just emitting an event
        emit Transfer(address(this), owner, amount);
    }
}

/*
DEPLOYMENT INSTRUCTIONS:

1. Open Remix IDE (https://remix.ethereum.org/)

2. Create a new file called "BlueCarbonToken.sol" and paste this code

3. Compile the contract:
   - Go to the "Solidity Compiler" tab
   - Select compiler version 0.8.19 or higher
   - Click "Compile BlueCarbonToken.sol"

4. Deploy to Sepolia:
   - Go to the "Deploy & Run Transactions" tab
   - Set Environment to "Injected Provider - MetaMask"
   - Make sure MetaMask is connected to Sepolia testnet
   - Select "BlueCarbonToken" from the contract dropdown
   - Click "Deploy"
   - Confirm the transaction in MetaMask

5. Copy the deployed contract address and update your .env file:
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x... (your deployed contract address)

6. The contract will be deployed with:
   - 1,000,000 BCT tokens minted to the deployer
   - Symbol: BCT
   - Decimals: 18
   - Full transfer, approval, and minting functionality

TESTING:
- You can interact with the contract directly in Remix
- Use the "transfer" function to send tokens to other addresses
- Use "balanceOf" to check token balances
- Use "mint" to create new tokens (only contract owner)

VERIFICATION (Optional):
- Go to https://sepolia.etherscan.io/
- Find your contract using the deployed address
- Click "Verify and Publish" to make the contract source code public
*/