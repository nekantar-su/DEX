const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require('truffle-assertions');

contract("Dex", accounts => {
    it.skip("Should make sure the user has enough Eth deposited for buyOrder", async()=>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.reverts(
            dex.createLimitOrder(50,1,web3.utils.fromUtf8("Link"),0)
        )
       await dex.depositEth({value:75})
       await link.approve(dex.address,500);
       await truffleAssert.passes(
        dex.createLimitOrder(50,1,web3.utils.fromUtf8("Link"),0)
           )

    })
    
    it.skip("Should make sure the user has enough tokens deposited such that tokenBal >= sell order amount", async() => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.reverts(
            dex.createLimitOrder(10,2,web3.utils.fromUtf8("Link"),1)
        )
        await link.approve(dex.address,500);
        await dex.addToken(web3.utils.fromUtf8("Link"),link.address,{from:accounts[0]})
        await dex.deposit(100,web3.utils.fromUtf8("Link"));
        await truffleAssert.passes(
            dex.createLimitOrder(10,2,web3.utils.fromUtf8("Link"),1)
        )

    })
    it.skip("Make sure BUY order book is ordered correctly", async() => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await dex.depositEth({value:500});
        await dex.createLimitOrder(2,2,web3.utils.fromUtf8("Link"),0);
        await dex.createLimitOrder(4,1,web3.utils.fromUtf8("Link"),0);
        await dex.createLimitOrder(3,3,web3.utils.fromUtf8("Link"),0);
        await dex.createLimitOrder(2,4,web3.utils.fromUtf8("Link"),0);
        let orderBook = await dex.getOrderBook(web3.utils.fromUtf8("Link"),0);
        //console.log(orderBook);
        for(let i = 0; i < orderBook.length -1 ; i++){
           assert(orderBook[i].price >= orderBook[i+1].price)
        }



        
    })
    it.skip("Make sure SELL order book is ordered correctly", async() => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await link.approve(dex.address,500);
        await dex.addToken(web3.utils.fromUtf8("Link"),link.address,{from:accounts[0]})
        await dex.deposit(100,web3.utils.fromUtf8("Link"));
        await dex.createLimitOrder(2,2,web3.utils.fromUtf8("Link"),1);
        await dex.createLimitOrder(4,1,web3.utils.fromUtf8("Link"),1);
        await dex.createLimitOrder(3,3,web3.utils.fromUtf8("Link"),1);
        await dex.createLimitOrder(2,4,web3.utils.fromUtf8("Link"),1);
        let orderBook = await dex.getOrderBook(web3.utils.fromUtf8("Link"),1);
        console.log(orderBook);
        for(let i = 0; i < orderBook.length -1 ; i++){
           assert(orderBook[i].price <= orderBook[i+1].price)
        }
    })
//Market Order Tests

    it.skip("Seller must have enough tokens for trade", async() => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.reverts(
            dex.createMarketOrder(10,web3.utils.fromUtf8("Link"),1)
        )
        await link.approve(dex.address,500);
        await dex.addToken(web3.utils.fromUtf8("Link"),link.address,{from:accounts[0]})
        await dex.deposit(100,web3.utils.fromUtf8("Link"));
        await truffleAssert.passes(
            dex.createMarketOrder(10,web3.utils.fromUtf8("Link"),1)
        )


    
    })
    it.skip("Buyer must have enough eth for the trade", async() => {
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.reverts(
            dex.createMarketOrder(50,web3.utils.fromUtf8("Link"),0)
        )
       await dex.depositEth({value:75})
       await link.approve(dex.address,500);
       await truffleAssert.passes(
        dex.createMarketOrder(50,web3.utils.fromUtf8("Link"),0)
           )

    
    })
    it.skip("Orders can be submitted even if the order book is empty ", async() => {
        let dex = await Dex.deployed();


    
    })
    it.skip("Orders should be filled until the order book is empty or order is 100% filled", async() => {




    
    })
    it.skip("Eth balance decreases after transaction ", async() => {
        let dex = await Dex.deployed();
        dex.depositEth({from:accounts[0],value:25})
        let preBal = web3.eth.getBalance(accounts[0]);
        dex.createMarketOrder(50,web3.utils.fromUtf8("Link"),0);
        assert(preBal < web3.eth.getBalance(accounts[0]));
    
    })
    it.skip("Filled limit orders should be removed from book ", async() => {
        let dex = await Dex.deployed();



    
    })





}) 
