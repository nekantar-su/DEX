pragma solidity 0.8.11;
import "./Wallet.sol";
pragma abicoder v2;

contract Dex is Wallet {
    using SafeMath for uint256;
    enum Side{BUY,SELL}

    struct Order{
        uint256 id;
        address trader;
        Side side;
        bytes32 ticker;
        uint256 amount;
        uint256 price;
        uint256 filled;
    }
    uint public orderId = 0;

    mapping(bytes32 => mapping(uint256 => Order[])) public orderBook;

    function getOrderBook(bytes32 ticker, Side side) view public returns (Order[] memory){
        return orderBook[ticker][uint(side)];
    }


    function createLimitOrder(uint256 _amount, uint256 _price, bytes32 _ticker, Side _side) public {
         if(_side == Side.BUY){
        require(balances[msg.sender][bytes32("ETH")] >= _amount.mul(_price),"You do not have the Eth balance to complete this");
        }
        else if(_side == Side.SELL){
        require(balances[msg.sender][_ticker] >= _amount,"You do not have enough tokens to complete this");
        }
        
        
        Order[] storage orders = orderBook[_ticker][uint(_side)];

        orders.push(
            Order(orderId, msg.sender, _side, _ticker, _amount, _price,0)
           );

       orderId++;

       uint i = orders.length > 0 ? orders.length - 1 :0;
        
        if(_side == Side.BUY){
            for(i; i > 0; i--){
                if(orders[i].price > orders[i-1].price){
                    Order memory temp = orders[i-1];
                    orders[i-1] = orders[i];
                    orders[i] = temp;
                }
            }
        }
        else if(_side == Side.SELL){
            for(i; i > 0; i--){
                if(orders[i].price < orders[i-1].price){
                    Order memory temp = orders[i];
                    orders[i] = orders[i-1];
                    orders[i-1] = temp;
                }
            }
            
        }

    } 

    function createMarketOrder(uint256 _amount, bytes32 _ticker, Side _side) public {
        uint orderBookSide;
        if(_side == Side.BUY){
            orderBookSide=1;
        }
        else{
            require(balances[msg.sender][_ticker] >= _amount,"Insufficient amount of tokens");
            orderBookSide=0;
        }
        Order[] storage orders = orderBook[_ticker][orderBookSide];
        uint totalFilled;

        for(uint i = 0; i< orders.length && totalFilled < _amount; i++){
           if(orders[i].amount.sub(orders[i].filled) > _amount.sub(totalFilled)){
               orders[i].filled = orders[i].filled.add(_amount);
               totalFilled = totalFilled.add(_amount);
           } 
        }

    }

    

}