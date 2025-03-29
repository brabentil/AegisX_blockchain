const { run } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.error("Please set CONTRACT_ADDRESS in your .env file");
    return;
  }

  console.log("Verifying contract on Etherscan...");
  try {
    // No constructor arguments for AegisX
    await run("verify:verify", {
      address: contractAddress
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    if (error.message.includes("already verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("Error verifying contract:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
