pragma solidity ^0.5.0;


contract PrivateQueue {

    struct Transaction {
        address tFrom;
        address tTo;
        uint256 tValue;
    }
    struct Users {
        address publicA;
        address privateA;
    }
    mapping (uint256 => Transaction) transactions;
    mapping (uint256 => mapping (uint256 => Transaction)) internal listOfTransactions;
    uint256 tranLength;
    Transaction[] public transAcc;


    // --- Events ---
    event Transfer(address indexed _from ,address indexed _to, uint256 _value);

    function transferFrom(address _from, address _to, uint256 _value) public {
        emit Transfer(_from, _to, _value);
    }

    function setTransaction( address  _from, address _to, uint256 _value) public {
        Transaction memory myTransaction = Transaction(_from,_to,_value);
        transAcc.push(myTransaction);
        emit Transfer(_from, _to, _value);
        transactions[tranLength] = myTransaction;
        tranLength++;
    }

    function getLength() public view returns (uint256) {
        return tranLength;
    }

    function getTransactions(uint256 _id)  public view returns (uint256, address, address) {
        return (transactions[_id].tValue, transactions[_id].tFrom, transactions[_id].tTo);
    }

}