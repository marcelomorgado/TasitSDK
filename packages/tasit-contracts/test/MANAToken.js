// Note:
// This test suite is using web3.js because contract deployment is made by a 3rd-party repository
// (and most existing 3rd-party contracts tend to use Truffle which uses web3.js)
contract("MANAToken", function(accounts) {
  const abi = require("../decentraland/mana/build/contracts/MANAToken.json")
    .abi;
  const address = "0xb32939da0c44bf255b9810421a55be095f9bb3f4";

  it("should get the MANAToken name", async function() {
    const MANAToken = new web3.eth.Contract(abi, address);

    const name = await MANAToken.methods.name().call();

    assert.equal(
      name,
      "Decentraland MANA",
      "Decentraland MANA isn't the MANAToken name."
    );
  });
});
