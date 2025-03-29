const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🔹 Starting local deployment...");
    console.log("Getting contract factory...");
    const AegisX = await ethers.getContractFactory("AegisX");
    
    console.log("Deploying AegisX contract to local network...");
    const aegisX = await AegisX.deploy();
    
    console.log(`✅ AegisX deployed to: ${aegisX.target}`);
    
    // Update the .env file with the contract address
    const envFilePath = path.join(__dirname, "..", ".env");
    try {
        let envContent = fs.readFileSync(envFilePath, "utf8");
        envContent = envContent.replace(/CONTRACT_ADDRESS=.*/g, `CONTRACT_ADDRESS=${aegisX.target}`);
        fs.writeFileSync(envFilePath, envContent);
        console.log("✅ CONTRACT_ADDRESS in .env updated automatically!");
    } catch (error) {
        console.error("❌ Could not update .env file automatically:", error);
        console.log(`Please manually set CONTRACT_ADDRESS=${aegisX.target} in your .env file`);
    }
    
    console.log("\n📋 Next steps:");
    console.log("1. Run this command to interact with your contract:");
    console.log(`   npx hardhat run scripts/interact.js --network localhost`);
    console.log("2. Keep the local blockchain node running in your other terminal window");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
