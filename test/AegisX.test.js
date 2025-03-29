const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AegisX Contract", function () {
  let aegisX;
  let owner;
  let addr1;
  
  beforeEach(async function () {
    // Deploy a new instance for each test
    const AegisX = await ethers.getContractFactory("AegisX");
    [owner, addr1] = await ethers.getSigners();
    // Modified deployment pattern for compatibility with newer ethers version
    aegisX = await AegisX.deploy();
    // Remove the .deployed() call as the contract is already deployed at this point
  });

  describe("Transaction Logging", function () {
    it("Should log a transaction and emit an event", async function () {
      const txId = "test_tx_123";
      const riskScore = 50;
      const flagged = false;

      await expect(aegisX.logTransaction(txId, riskScore, flagged))
        .to.emit(aegisX, "TransactionLogged")
        .withArgs(txId, riskScore, flagged);
    });

    it("Should retrieve correct transaction details", async function () {
      const txId = "test_tx_456";
      const riskScore = 85;
      const flagged = true;

      await aegisX.logTransaction(txId, riskScore, flagged);
      
      const [retrievedScore, retrievedFlag] = await aegisX.verifyTransaction(txId);
      expect(retrievedScore).to.equal(riskScore);
      expect(retrievedFlag).to.equal(flagged);
    });

    it("Should process batch transactions correctly", async function () {
      const txIds = ["batch_1", "batch_2", "batch_3"];
      const scores = [30, 60, 90];
      const flags = [false, false, true];

      await aegisX.batchLogTransactions(txIds, scores, flags);
      
      for (let i = 0; i < txIds.length; i++) {
        const [score, flag] = await aegisX.verifyTransaction(txIds[i]);
        expect(score).to.equal(scores[i]);
        expect(flag).to.equal(flags[i]);
      }
    });
  });

  describe("Risk Assessment Updates", function () {
    it("Should update risk assessment correctly", async function () {
      const txId = "update_test";
      const initialScore = 40;
      const initialFlag = false;
      
      await aegisX.logTransaction(txId, initialScore, initialFlag);
      
      const newScore = 85;
      const newFlag = true;
      
      await aegisX.updateRiskAssessment(txId, newScore, newFlag);
      
      const [retrievedScore, retrievedFlag] = await aegisX.verifyTransaction(txId);
      expect(retrievedScore).to.equal(newScore);
      expect(retrievedFlag).to.equal(newFlag);
    });
    
    it("Should revert when updating non-existent transaction", async function () {
      await expect(
        aegisX.updateRiskAssessment("non_existent", 50, true)
      ).to.be.revertedWith("Transaction does not exist");
    });
  });
});
