const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🔹 Deploying AegisX contract...");
    const AegisX = await ethers.getContractFactory("AegisX");
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
    
    console.log("\n📋 Next step: npx hardhat run scripts/interact.js --network localhost");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

