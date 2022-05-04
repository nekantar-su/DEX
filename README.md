# DEX
Decentralized Exchange 2021-2022

Exchange created to swap tokens and create a market place.
Similar to UniSwap and other popluar exchanges.
Built on Ethereum 

To Start:
Must have Truffle and Solidity installed:
1) Open a terminal window and run truffle compile to compile contracts
2) Run truffle develop to fire up node with accounts/private keys
3) Run migrate to deploy contract
4) For whatever token created must initialize as ERC20. Mine is set to link: let link = await Link.deployed()
Can be modified by adjusting Token contract. Currently set to chainlink,link. And minted 1000 when created. Can use any ERC20 function.
5) Initiate dex by let dex = await Dex.deployed()
6) Add token to dex: Dex.addToken(web3.utils.fromUtf8("Link"),link.address)
Can check if token exists before continuing: 
dex.tokenMapping(web3.utils.fromUtf8("Link")) , make sure 'token address' equals link.address
7)Approve dex for spending from link: link.approve(dex.address,amount)
8) Deposit link : dex.depost(100,web3.utils.fromUtf8("Link"))
9) Now can call functions like createLimitorder and MarketOrder. Check getOrderBook as well!
