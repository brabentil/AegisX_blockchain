const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

/**
 * BlockchainConnector - A utility class to connect frontend to Aegis blockchain contracts
 */
class BlockchainConnector {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.contractAddress = process.env.CONTRACT_ADDRESS || '';
    this.networkUrl = '';
    this.connected = false;
  }

  /**
   * Initialize the blockchain connector with optional custom configuration
   * @param {Object} config - Configuration options
   * @param {string} config.contractName - Name of the contract (defaults to "AegisX")
   * @param {string} config.networkUrl - Custom RPC URL (optional)
   * @param {string} config.contractAddress - Custom contract address (optional)
   */
  async initialize(config = {}) {
    try {
      // Set contract name - default to AegisX, but allow using AegisXLite too
      const contractName = config.contractName || 'AegisX';
      
      // Set network URL - use provided URL or attempt to get from environment
      this.networkUrl = config.networkUrl || process.env.SEPOLIA_URL || 'http://localhost:8545';
      
      // Use provided contract address or get from environment
      this.contractAddress = config.contractAddress || this.contractAddress;

      if (!this.contractAddress) {
        console.error('Contract address not specified. Please provide a contract address.');
        return false;
      }

      console.log(`Connecting to blockchain at: ${this.networkUrl}`);
      console.log(`Using contract: ${contractName} at address: ${this.contractAddress}`);

      // Create provider
      this.provider = new ethers.JsonRpcProvider(this.networkUrl);

      // Load contract ABI
      const abiPath = path.resolve(__dirname, '..', 'artifacts', 'contracts', `${contractName}.sol`, `${contractName}.json`);
      
      if (!fs.existsSync(abiPath)) {
        console.error(`ABI file not found at ${abiPath}`);
        console.error('Please ensure you have compiled your contracts with: npx hardhat compile');
        return false;
      }
      
      const contractArtifact = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      const abi = contractArtifact.abi;

      // Initialize contract interface
      this.contract = new ethers.Contract(this.contractAddress, abi, this.provider);
      
      // Verify connection
      await this.provider.getBlockNumber();
      this.connected = true;
      
      console.log('✅ Blockchain connector initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain connector:', error);
      return false;
    }
  }

  /**
   * Connect with a wallet to enable transactions
   * @param {Object} walletOptions - Options for connecting wallet
   * @param {string} walletOptions.privateKey - Private key (if available)
   * @param {object} walletOptions.externalProvider - External provider (like MetaMask)
   */
  async connectWallet(walletOptions = {}) {
    try {
      if (!this.connected || !this.provider) {
        console.error('Please initialize the connector first with initialize()');
        return false;
      }

      if (walletOptions.privateKey) {
        // Connect using private key (backend or testing)
        this.signer = new ethers.Wallet(walletOptions.privateKey, this.provider);
      } 
      else if (walletOptions.externalProvider) {
        // Connect using injected provider like MetaMask (frontend)
        const externalProvider = new ethers.BrowserProvider(walletOptions.externalProvider);
        this.signer = await externalProvider.getSigner();
      }
      else {
        console.error('No wallet connection method provided');
        return false;
      }

      // Connect contract to signer for sending transactions
      this.contract = this.contract.connect(this.signer);
      console.log('✅ Wallet connected successfully');
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }

  /**
   * Log a security transaction to the blockchain
   * @param {string} transactionId - Unique identifier for the transaction
   * @param {number} riskScore - Risk score (0-100)
   * @param {boolean} flagged - Whether the transaction is flagged as suspicious
   */
  async logTransaction(transactionId, riskScore, flagged) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      const tx = await this.contract.logTransaction(transactionId, riskScore, flagged);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Failed to log transaction:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Verify a previously logged transaction
   * @param {string} transactionId - The ID of the transaction to verify
   */
  async verifyTransaction(transactionId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      const [riskScore, flagged] = await this.contract.verifyTransaction(transactionId);
      
      return {
        success: true,
        riskScore: Number(riskScore),
        flagged: flagged,
        transactionId
      };
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Update risk assessment for a transaction
   * @param {string} transactionId - The ID of the transaction
   * @param {number} newRiskScore - Updated risk score
   * @param {boolean} newFlaggedStatus - Updated flagged status
   */
  async updateRiskAssessment(transactionId, newRiskScore, newFlaggedStatus) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      const tx = await this.contract.updateRiskAssessment(
        transactionId, 
        newRiskScore, 
        newFlaggedStatus
      );
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Failed to update risk assessment:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Get contract connection status
   */
  getStatus() {
    return {
      connected: this.connected,
      contractAddress: this.contractAddress,
      networkUrl: this.networkUrl,
      hasWallet: !!this.signer
    };
  }
}

module.exports = BlockchainConnector;
