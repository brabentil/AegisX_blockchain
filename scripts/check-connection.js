const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  try {
    console.log("Sepolia URL:", process.env.SEPOLIA_URL);
    
    // Check if we can connect to the Sepolia network with a timeout
    console.log("Creating provider instance...");
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL, undefined, {
      timeout: 30000, // Increase timeout to 30 seconds
      polling: true,
      pollingInterval: 1000
    });
    
    // Try a simple request first
    console.log("Testing connection with basic request...");
    const blockNumber = await provider.getBlockNumber();
    console.log(`Current block number: ${blockNumber}`);
    
    // Try to get the network info
    console.log("Getting network information...");
    const network = await provider.getNetwork();
    
    console.log("Successfully connected to network:");
    console.log(`  Network name: ${network.name}`);
    console.log(`  Chain ID: ${network.chainId}`);
    
    // Check account balance
    if (process.env.PRIVATE_KEY) {
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      console.log(`\nWallet address: ${wallet.address}`);
      
      const balance = await provider.getBalance(wallet.address);
      console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
      
      if (balance == 0n) {
        console.log("\n⚠️ WARNING: Your wallet has 0 ETH. You need to get test ETH from a faucet before deploying.");
        console.log("Recommended Sepolia faucets:");
        console.log("- https://sepoliafaucet.com/");
        console.log("- https://faucet.sepolia.dev/");
      } else {
        console.log("\n✅ You have enough ETH to deploy contracts!");
      }
    }
    
  } catch (error) {
    console.error("Failed to connect to Sepolia network:");
    console.error(error.message);
    
    if (error.message.includes("timeout")) {
      console.error("\nTimeout error detected. Possible causes:");
      console.error("- Network connectivity issues");
      console.error("- RPC endpoint may be overloaded or down");
      console.error("- Firewall or security software blocking the connection");
    } else if (error.message.includes("403") || error.message.includes("Forbidden")) {
      console.error("\nAccess forbidden error detected. Possible causes:");
      console.error("- The RPC endpoint requires an API key");
      console.error("- Rate limiting may be in effect");
    }
    
    console.error("\nPossible solutions:");
    console.error("1. Try these alternative RPC endpoints in your .env file:");
    console.error("   - SEPOLIA_URL=https://eth-sepolia.public.blastapi.io");
    console.error("   - SEPOLIA_URL=https://ethereum-sepolia-rpc.publicnode.com");
    console.error("   - SEPOLIA_URL=https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    console.error("2. Create your own API key on a service like Alchemy or Infura");
    console.error("3. Check your internet connection and try again");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
