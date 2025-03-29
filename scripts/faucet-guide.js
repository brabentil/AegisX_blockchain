const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  try {
    // Display wallet address for faucet requests
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.error("No private key found in .env file");
      return;
    }
    
    // Create a wallet instance from the private key
    const wallet = new ethers.Wallet(privateKey);
    
    // Connect to the network to check balance
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
    const connectedWallet = wallet.connect(provider);
    
    const balance = await provider.getBalance(wallet.address);
    const formattedBalance = ethers.formatEther(balance);
    
    // Display detailed faucet guide
    console.log("📋 SEPOLIA TEST ETH ACQUISITION GUIDE 📋");
    console.log("=======================================");
    console.log(`Your wallet address: ${wallet.address}`);
    console.log(`Current balance: ${formattedBalance} ETH`);
    console.log("\n1️⃣ COPY your wallet address shown above");
    
    if (parseFloat(formattedBalance) < 0.01) {
      console.log("\n⚠️ Your balance is too low for contract deployment!");
      console.log("You need at least 0.01 ETH to deploy and interact with your contract.");
    } else {
      console.log("\n✅ Your balance is sufficient for deployment!");
      console.log("You're good to go with deploying your contract.");
    }
    
    console.log("\n2️⃣ GET TEST ETH FROM THESE FAUCETS:");
    console.log("---------------------------------------");
    console.log("🚰 Alchemy Sepolia Faucet:");
    console.log("   https://sepoliafaucet.com");
    console.log("   - Create an Alchemy account if you don't have one");
    console.log("   - Paste your wallet address");
    console.log("   - Receive 0.5 Sepolia ETH\n");
    
    console.log("🚰 Infura Sepolia Faucet:");
    console.log("   https://www.infura.io/faucet/sepolia");
    console.log("   - Connect wallet or paste address");
    console.log("   - Complete verification if required");
    console.log("   - Receive Sepolia ETH\n");
    
    console.log("🚰 Sepolia PoW Faucet (alternative):");
    console.log("   https://sepolia-faucet.pk910.de/");
    console.log("   - Mine directly in your browser");
    console.log("   - No registration required");
    console.log("   - Enter your wallet address\n");
    
    console.log("3️⃣ AFTER RECEIVING ETH:");
    console.log("---------------------------------------");
    console.log("1. Check your balance again:");
    console.log("   npx hardhat run scripts/check-connection.js");
    console.log("2. Deploy your contract:");
    console.log("   npx hardhat run scripts/deploy.js --network sepolia\n");
    
    console.log("💡 TIP: If one faucet isn't working, try another!");
    
  } catch (error) {
    console.error("Error fetching wallet information:");
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
