const { ethers } = require("hardhat");

async function main() {
    console.log("Getting lightweight contract factory...");
    const AegisXLite = await ethers.getContractFactory("AegisXLite");
    
    console.log("Deploying AegisXLite contract (low gas version)...");
    const aegisXLite = await AegisXLite.deploy();
    
    console.log(`AegisXLite deployed to: ${aegisXLite.target}`);
    console.log("This is a simplified version that uses less gas for deployment.");
    console.log("----------------------------------------------");
    console.log("To interact with the contract:");
    console.log("1. Update CONTRACT_ADDRESS in .env with this address");
    console.log("2. Modify scripts/interact.js to use 'AegisXLite' instead of 'AegisX'");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
