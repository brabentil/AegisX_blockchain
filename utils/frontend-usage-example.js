/**
 * EXAMPLE: How to use BlockchainConnector in a frontend application
 * 
 * In a real frontend app, you would:
 * 1. Import this file (or convert to TypeScript)
 * 2. Use these patterns to connect to your contract
 */

// Import the connector (in browser, you'd use import/require based on your bundler)
const BlockchainConnector = require('./blockchain-connector');

/**
 * Example function showing how to initialize connection to blockchain
 */
async function connectToBlockchain() {
  // Create instance
  const aegisConnector = new BlockchainConnector();
  
  // Initialize with configuration
  const initialized = await aegisConnector.initialize({
    contractName: 'AegisX', // or 'AegisXLite' for the lightweight version
    networkUrl: 'http://localhost:8545', // Your network URL
    contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Contract address
  });
  
  if (!initialized) {
    console.error('Failed to initialize blockchain connection');
    return null;
  }
  
  // This part specifically connects to MetaMask in a browser environment
  if (window.ethereum) {
    await aegisConnector.connectWallet({
      externalProvider: window.ethereum
    });
  }
  
  return aegisConnector;
}

/**
 * Example function to log a security event
 */
async function logSecurityEvent(connector, eventData) {
  const { transactionId, riskScore, isFlagged } = eventData;
  
  const result = await connector.logTransaction(
    transactionId,
    riskScore,
    isFlagged
  );
  
  return result;
}

/**
 * Example function to verify a previously logged event
 */
async function verifySecurityEvent(connector, transactionId) {
  const result = await connector.verifyTransaction(transactionId);
  return result;
}

// Example of how these would be used in a React component or other frontend code
async function exampleUsage() {
  // Connect to blockchain
  const connector = await connectToBlockchain();
  if (!connector) return;
  
  // Log a new security event
  const eventData = {
    transactionId: 'threat_' + Date.now(),
    riskScore: 85,
    isFlagged: true
  };
  
  const logResult = await logSecurityEvent(connector, eventData);
  console.log('Event logged:', logResult);
  
  // Verify the event
  const verifyResult = await verifySecurityEvent(connector, eventData.transactionId);
  console.log('Verification result:', verifyResult);
}

// In a real app, you'd call functions when needed rather than immediately executing
// exampleUsage();
