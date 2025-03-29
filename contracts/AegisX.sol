// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AegisX {
    struct Transaction {
        string txId;
        uint256 riskScore;
        bool flagged;
    }

    mapping(string => Transaction) private transactions;
    event TransactionLogged(string txId, uint256 riskScore, bool flagged);

    function logTransaction(string memory _txId, uint256 _riskScore, bool _flagged) public {
        transactions[_txId] = Transaction(_txId, _riskScore, _flagged);
        emit TransactionLogged(_txId, _riskScore, _flagged);
    }

    function verifyTransaction(string memory _txId) public view returns (uint256, bool) {
        Transaction memory transaction = transactions[_txId];
        return (transaction.riskScore, transaction.flagged);
    }
    
    // Additional functionality for more advanced fraud detection
    function batchLogTransactions(
        string[] memory _txIds, 
        uint256[] memory _riskScores, 
        bool[] memory _flagged
    ) public {
        require(_txIds.length == _riskScores.length && _riskScores.length == _flagged.length, "Arrays must be of equal length");
        
        for (uint i = 0; i < _txIds.length; i++) {
            logTransaction(_txIds[i], _riskScores[i], _flagged[i]);
        }
    }
    
    // Function to update risk assessment
    function updateRiskAssessment(string memory _txId, uint256 _newRiskScore, bool _newFlagStatus) public {
        require(bytes(transactions[_txId].txId).length > 0, "Transaction does not exist");
        
        transactions[_txId].riskScore = _newRiskScore;
        transactions[_txId].flagged = _newFlagStatus;
        
        emit TransactionLogged(_txId, _newRiskScore, _newFlagStatus);
    }
}
