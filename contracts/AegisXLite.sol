// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AegisXLite {
    // Simplified data structure to use less storage
    mapping(string => uint256) private riskScores;
    mapping(string => bool) private flaggedTxs;
    
    event TransactionLogged(string txId, uint256 riskScore, bool flagged);

    // Core functionality only
    function logTransaction(string memory _txId, uint256 _riskScore, bool _flagged) public {
        riskScores[_txId] = _riskScore;
        flaggedTxs[_txId] = _flagged;
        emit TransactionLogged(_txId, _riskScore, _flagged);
    }

    function verifyTransaction(string memory _txId) public view returns (uint256, bool) {
        return (riskScores[_txId], flaggedTxs[_txId]);
    }
}
