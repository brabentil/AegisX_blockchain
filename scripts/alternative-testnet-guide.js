const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  console.log("🌐 ALTERNATIVE TESTNET DEPLOYMENT OPTIONS 🌐");
  console.log("===========================================");
  
  console.log("\n1️⃣ OPTION: HOLESKY TESTNET");
  console.log("   - Holesky is newer with more generous faucets");
  console.log("   - Faucet: https://holesky-faucet.pk910.de/");
  console.log("   - Add to hardhat.config.js:");
  console.log(`
    holesky: {
      url: "https://ethereum-holesky-rpc.publicnode.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 17000
    }`);
  
  console.log("\n2️⃣ OPTION: POLYGON MUMBAI TESTNET");
  console.log("   - Usually easier to get test MATIC");
  console.log("   - Faucet: https://mumbaifaucet.com/");
  console.log("   - Add to hardhat.config.js:");
  console.log(`
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001
    }`);
  
  console.log("\n💡 After updating hardhat.config.js, deploy with:");
  console.log("   npx hardhat run scripts/deploy.js --network holesky");
  console.log("   or");
  console.log("   npx hardhat run scripts/deploy.js --network mumbai");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
