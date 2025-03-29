const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  // Use the private key from your .env file
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.error("No private key found in .env file");
    return;
  }
  
  // Create a wallet instance from the private key (updated for ethers.js v6)
  const wallet = new ethers.Wallet(privateKey);
  
  // Get the address
  console.log("Your wallet address:", wallet.address);
  console.log("Use this address when requesting funds from the Sepolia faucet");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
