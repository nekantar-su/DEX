pragma solidity 0.8.11;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Link is ERC20{
    constructor() ERC20("Chainlink","Link"){
        _mint(msg.sender,1000);
    }
}