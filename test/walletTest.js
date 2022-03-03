const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require('truffle-assertions');

contract.skip("Dex", accounts => {
    it("Should only be possible for owner to add tokens", async() => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.passes(
            dex.addToken(web3.utils.fromUtf8("Link"),link.address,{from:accounts[0]})
        )
        await truffleAssert.reverts(
            dex.addToken(web3.utils.fromUtf8("Link"),link.address,{from:accounts[1]})
        )
    })
    it("Should handle deposits correctly", async() => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await link.approve(dex.address,500);
        await dex.deposit(100,web3.utils.fromUtf8("Link"));
        let balance = await dex.balances(accounts[0],web3.utils.fromUtf8("Link"))
        assert.equal(balance.toNumber(),100)
    })
    it("Should handle faulty withdrawls correctly", async() => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.reverts(
            dex.withdraw(500,web3.utils.fromUtf8("Link"),{from:accounts[0]})
        )
    })
    it("Should handle correct withdrawls correctly", async() => {
        let dex = await Dex.deployed()
        let link = await Link.deployed()
        await truffleAssert.passes(
            dex.withdraw(50,web3.utils.fromUtf8("Link"),{from:accounts[0]})
        )
    })
})