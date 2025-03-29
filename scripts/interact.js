const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // Get the deployed contract
  const AegisX = await ethers.getContractFactory("AegisX");
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.error("Please set CONTRACT_ADDRESS in your .env file");
    return;
  }
  
  const contract = await AegisX.attach(contractAddress);
  console.log(`Interacting with AegisX at address: ${contract.target}`);
  
  // Log a transaction
  const txId = "tx_" + Date.now().toString();
  console.log(`\n1️⃣ Logging transaction: ${txId}, Risk Score: 75, Flagged: true`);
  await (await contract.logTransaction(txId, 75, true)).wait();
  
  // Verify the transaction
  const [score1, flagged1] = await contract.verifyTransaction(txId);
  console.log(`✅ Verification: Risk Score: ${score1}, Flagged: ${flagged1}`);
  
  // Log a second transaction with lower risk
  const txId2 = "tx_low_" + Date.now().toString();
  console.log(`\n2️⃣ Logging low-risk transaction: ${txId2}, Risk Score: 30, Flagged: false`);
  await (await contract.logTransaction(txId2, 30, false)).wait();
  
  // Update the risk assessment
  console.log(`\n3️⃣ Updating risk assessment for ${txId2}`);
  await (await contract.updateRiskAssessment(txId2, 90, true)).wait();
  
  // Verify the updated transaction
  const [score2, flagged2] = await contract.verifyTransaction(txId2);
  console.log(`✅ Updated verification: Risk Score: ${score2}, Flagged: ${flagged2}`);
  
  console.log("\n🔍 All interactions completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
