# AegisX Blockchain Project

A secure, efficient blockchain solution for transaction verification and risk assessment. AegisX provides a reliable framework for logging security events, assessing transaction risk, and maintaining an immutable record of security assessments.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Smart Contracts](#smart-contracts)
- [Installation](#installation)
- [Usage](#usage)
  - [Local Development](#local-development)
  - [Contract Interaction](#contract-interaction)
- [Testing](#testing)
  - [Test Results](#test-results)
  - [Gas Usage Analysis](#gas-usage-analysis)
  - [Performance Analysis](#performance-analysis)
- [Frontend Integration](#frontend-integration)
- [Testnet Deployment](#testnet-deployment)
  - [Getting Test ETH](#getting-test-eth)
  - [Deployment Steps](#deployment-steps)
- [Alternative Testnets](#alternative-testnets)

## Overview

AegisX leverages blockchain technology to provide immutable, transparent security assessments for transactions. The system assigns risk scores to transactions and maintains a permanent record that can be verified by authorized parties. This project demonstrates how blockchain can be used for secure, transparent risk assessment in real-world applications.

## Features

- **Transaction Logging**: Record transactions with risk scores and flagging status
- **Risk Verification**: Query the blockchain to verify risk assessments for any recorded transaction
- **Risk Assessment Updates**: Modify risk assessments for existing transactions when new information becomes available
- **Batch Processing**: Submit multiple transactions at once for gas efficiency
- **Gas Optimization**: Carefully designed for minimal gas consumption
- **Frontend Integration Utilities**: Ready-to-use connector for web applications
- **Two Contract Options**: Full feature set or lightweight implementation

## Smart Contracts

The project includes two contract implementations:

### AegisX (Full Implementation)

```solidity
// Main contract with complete functionality
contract AegisX {
    struct Transaction {
        string txId;
        uint256 riskScore;
        bool flagged;
    }

    mapping(string => Transaction) private transactions;
    event TransactionLogged(string txId, uint256 riskScore, bool flagged);

    // ...existing code...
    
    function updateRiskAssessment(string memory _txId, uint256 _newRiskScore, bool _newFlagStatus) public {
        require(bytes(transactions[_txId].txId).length > 0, "Transaction does not exist");
        
        // ...existing code...
    }
}
```

### AegisXLite (Lightweight Version)

```solidity
// Lightweight implementation with reduced gas costs
contract AegisXLite {
    // Simplified data structure to use less storage
    mapping(string => uint256) private riskScores;
    mapping(string => bool) private flaggedTxs;
    
    // ...existing code...
}
```

## Installation

1. Clone the repository
2. Install dependencies:

```bash
cd blockchain
npm install
```

3. Configure environment variables:

The project comes with a pre-configured `.env` file for local development:

## Usage

### Local Development

1. Start a local blockchain:
   ```bash
   npx hardhat node
   ```

2. In a new terminal, deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

### Contract Interaction

3. Interact with the contract:
   ```bash
   npx hardhat run scripts/interact.js --network localhost
   ```

## Testing

Run the test suite:

```bash
npx hardhat test
```

### Test Results

The AegisX contract successfully passes all tests:

```
AegisX Contract
    Transaction Logging
      ✔ Should log a transaction and emit an event
      ✔ Should retrieve correct transaction details
      ✔ Should process batch transactions correctly
    Risk Assessment Updates
      ✔ Should update risk assessment correctly
      ✔ Should revert when updating non-existent transaction
```

### Gas Usage Analysis

```
·-------------------------------------|---------------------------|-------------|-----------------------------·
|        Solc version: 0.8.28         ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
······································|···························|·············|······························
|  Methods                                                                                                    │
·············|························|·············|·············|·············|···············|··············
|  Contract  ·  Method                ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·············|························|·············|·············|·············|···············|··············
|  AegisX    ·  batchLogTransactions  ·          -  ·          -  ·     197356  ·            1  ·          -  │
·············|························|·············|·············|·············|···············|··············
|  AegisX    ·  logTransaction        ·      72274  ·      92186  ·      77252  ·            4  ·          -  │
·············|························|·············|·············|·············|···············|··············
|  AegisX    ·  updateRiskAssessment  ·          -  ·          -  ·      55300  ·            1  ·          -  │
·············|························|·············|·············|·············|···············|··············
|  Deployments                        ·                                         ·  % of limit   ·             │
······································|·············|·············|·············|···············|··············
|  AegisX                             ·          -  ·          -  ·     587044  ·          2 %  ·          -  │
·-------------------------------------|-------------|-------------|-------------|---------------|-------------·
```

### Performance Analysis

- **Contract Deployment**: Uses only 2% of the block gas limit (587,044 gas)
- **logTransaction**: Average cost of 77,252 gas
- **batchLogTransactions**: 197,356 gas (efficient for multiple transactions)
- **updateRiskAssessment**: 55,300 gas

The test results demonstrate that the AegisX contract efficiently implements all required functionality while maintaining security constraints, such as preventing updates to non-existent transactions.

## Frontend Integration

The project includes a comprehensive `BlockchainConnector` utility class for integrating with frontend applications:

```javascript
// Initialize connection to blockchain
const aegisConnector = new BlockchainConnector();
await aegisConnector.initialize({
  contractName: 'AegisX', // or 'AegisXLite' for the lightweight version
  networkUrl: 'http://localhost:8545', // Your network URL
  contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
});

// Connect wallet (browser environment with MetaMask)
if (window.ethereum) {
  await aegisConnector.connectWallet({
    externalProvider: window.ethereum
  });
}

// Log a security event
const eventData = {
  transactionId: 'threat_' + Date.now(),
  riskScore: 85,
  isFlagged: true
};
const logResult = await aegisConnector.logTransaction(
  eventData.transactionId, 
  eventData.riskScore, 
  eventData.isFlagged
);

// Verify a transaction
const verifyResult = await aegisConnector.verifyTransaction(eventData.transactionId);

// Update risk assessment
const updateResult = await aegisConnector.updateRiskAssessment(
  eventData.transactionId,
  95, // new risk score
  true // new flagged status
);
```

The connector handles all the blockchain interactions and error handling, making it easy to integrate AegisX into any web application.

## Testnet Deployment

### Getting Test ETH

Before deploying to a testnet, you need to get test ETH from a faucet.

1. Get your wallet address:

```bash
npx hardhat run scripts/get-address.js
```

2. Get test ETH from one of these Sepolia faucets:

- **Alchemy Sepolia Faucet**: https://sepoliafaucet.com
  - Create an Alchemy account if needed
  - Paste your wallet address
  - Receive 0.5 Sepolia ETH

- **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
  - Connect wallet or paste address
  - Complete verification if required
  - Receive Sepolia ETH

- **Sepolia PoW Faucet (alternative)**: https://sepolia-faucet.pk910.de/
  - Mine directly in your browser
  - No registration required
  - Enter your wallet address

3. Check your balance:

```bash
npx hardhat run scripts/check-connection.js
```

### Deployment Steps

1. Ensure you have sufficient test ETH (at least 0.01 ETH)

2. Deploy to Sepolia testnet:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Verify your contract on Etherscan (optional but recommended):

```bash
npx hardhat run scripts/verify.js --network sepolia
```

4. Interact with your deployed contract:

```bash
npx hardhat run scripts/interact.js --network sepolia
```

## Alternative Testnets

The project supports deployment to multiple testnets:

### Holesky Testnet

```javascript
// Add to hardhat.config.js
holesky: {
  url: "https://ethereum-holesky-rpc.publicnode.com",
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  chainId: 17000
}
```

- Faucet: https://holesky-faucet.pk910.de/

### Polygon Mumbai Testnet

```javascript
// Add to hardhat.config.js
mumbai: {
  url: "https://rpc-mumbai.maticvigil.com",
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  chainId: 80001
}
```

- Faucet: https://mumbaifaucet.com/

After adding the configuration, deploy with:

```bash
npx hardhat run scripts/deploy.js --network holesky
```

or

```bash
npx hardhat run scripts/deploy.js --network mumbai
```
