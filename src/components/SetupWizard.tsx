import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle, ExternalLink, Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SetupWizard() {
  const [contractAddress, setContractAddress] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Get Sepolia ETH',
    'Deploy Contract',
    'Configure Address'
  ];

  const handleSetContractAddress = () => {
    if (!contractAddress || !contractAddress.startsWith('0x') || contractAddress.length !== 42) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    // Use the global function if available
    if ((window as any).setContractAddress) {
      (window as any).setContractAddress(contractAddress);
      toast.success('Contract address set! Please refresh the page.');
    } else {
      // Fallback method
      if (!window.ENV) {
        (window as any).ENV = {};
      }
      (window as any).ENV.NEXT_PUBLIC_CONTRACT_ADDRESS = contractAddress;
      localStorage.setItem('BLUEMERCANTILE_CONTRACT_ADDRESS', contractAddress);
      toast.success('Contract address set! Please refresh the page.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Web3 Setup Wizard</h2>
        <p className="text-gray-600">Get your BlueCarbonToken contract up and running in 3 steps</p>
      </div>

      <Tabs value={steps[activeStep]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {steps.map((step, index) => (
            <TabsTrigger 
              key={step} 
              value={step}
              className="flex items-center gap-2"
              onClick={() => setActiveStep(index)}
            >
              {index < activeStep ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-xs text-white">
                  {index + 1}
                </span>
              )}
              {step}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Get Sepolia ETH" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Get Sepolia Test ETH</h3>
            <p className="text-gray-600">
              You need Sepolia ETH to deploy your contract and pay for gas fees. Get free testnet ETH from these faucets:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <h4 className="font-medium mb-2">Chainlink Faucet</h4>
                <p className="text-sm text-gray-600 mb-3">0.1 ETH per request</p>
                <Button 
                  onClick={() => window.open('https://faucets.chain.link/sepolia', '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Chainlink Faucet
                </Button>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">Sepolia Faucet</h4>
                <p className="text-sm text-gray-600 mb-3">0.5 ETH per request</p>
                <Button 
                  onClick={() => window.open('https://sepoliafaucet.com/', '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Sepolia Faucet
                </Button>
              </Card>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Copy your MetaMask wallet address and paste it into the faucet to receive free Sepolia ETH.
                You'll need about 0.01-0.05 ETH to deploy the contract.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={() => setActiveStep(1)}
              className="w-full"
            >
              I have Sepolia ETH - Next Step
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="Deploy Contract" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Deploy BlueCarbonToken Contract</h3>
            <p className="text-gray-600">
              Use Remix IDE to deploy your BlueCarbonToken contract to Sepolia testnet.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Contract Code</h4>
              <p className="text-sm text-gray-600 mb-2">
                The complete contract code is ready for you to copy and deploy:
              </p>
              <Button 
                variant="outline"
                onClick={() => copyToClipboard(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BlueCarbonToken {
    string public name = "BlueCarbonToken";
    string public symbol = "BCT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    address public owner;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        uint256 initialSupply = 1000000 * 10**decimals;
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
        emit Mint(msg.sender, initialSupply);
    }
    
    function transfer(address to, uint256 amount) public returns (bool success) {
        require(to != address(0), "Cannot transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) public returns (bool success) {
        require(spender != address(0), "Cannot approve zero address");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
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
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
    }
}`)}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Contract Code
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline">1</Badge>
                <span className="text-sm">Open Remix IDE</span>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => window.open('https://remix.ethereum.org/', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  remix.ethereum.org
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline">2</Badge>
                <span className="text-sm">Create new file: BlueCarbonToken.sol</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline">3</Badge>
                <span className="text-sm">Paste the contract code and compile</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline">4</Badge>
                <span className="text-sm">Deploy to Sepolia testnet via MetaMask</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline">5</Badge>
                <span className="text-sm">Copy the deployed contract address</span>
              </div>
            </div>

            <Button 
              onClick={() => setActiveStep(2)}
              className="w-full"
            >
              Contract Deployed - Next Step
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="Configure Address" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Configure Contract Address</h3>
            <p className="text-gray-600">
              Enter your deployed contract address to enable Web3 features.
            </p>

            <div className="space-y-3">
              <Label htmlFor="contract-address">BlueCarbonToken Contract Address</Label>
              <Input
                id="contract-address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
            </div>

            <Button 
              onClick={handleSetContractAddress}
              disabled={!contractAddress}
              className="w-full"
            >
              Set Contract Address
            </Button>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Once you set the contract address, refresh the page to start using real Web3 features!
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default SetupWizard;