const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  console.log("🔷 LOCAL DEPLOYMENT GUIDE 🔷");
  console.log("============================");
  console.log("\n1️⃣ START A LOCAL BLOCKCHAIN");
  console.log("   Open a new terminal and run:");
  console.log("   npx hardhat node");
  console.log("\n   This will start a local blockchain with 20 pre-funded accounts.");
  
  console.log("\n2️⃣ DEPLOY YOUR CONTRACT");
  console.log("   In a separate terminal, run:");
  console.log("   npx hardhat run scripts/deploy.js --network localhost");
  
  console.log("\n3️⃣ INTERACT WITH YOUR CONTRACT");
  console.log("   Update CONTRACT_ADDRESS in your .env file");
  console.log("   Run: npx hardhat run scripts/interact.js --network localhost");
  
  console.log("\n4️⃣ CONNECT WEB FRONTEND (if applicable)");
  console.log("   Configure your web app to connect to http://localhost:8545");
  console.log("   Use the contract address from the deployment step");
  
  console.log("\n💡 NOTE: The local blockchain resets when you stop the node.");
  console.log("   Any deployed contracts will be lost when you terminate the process.");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
