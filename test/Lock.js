// test/QuickNodeNFT.test.js
const { expect } = require("chai");

describe("QuickNodeNFT", function () {
  let QuickNodeNFT;
  let quickNodeNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract before each test
    QuickNodeNFT = await ethers.getContractFactory("QuickNodeNFT");
    quickNodeNFT = await QuickNodeNFT.deploy(owner.address);
  });

  it("Should set the right owner", async function () {
    expect(await quickNodeNFT.owner()).to.equal(owner.address);
  });

  it("Should mint a new token", async function () {
    const tokenId = 1;
    const uri = "token-uri";

    // Mint a new token
    await quickNodeNFT.connect(owner).mint(addr1.address, tokenId, uri);

    // Check if the token was minted correctly
    expect(await quickNodeNFT.ownerOf(tokenId)).to.equal(addr1.address);
    expect(await quickNodeNFT.tokenURI(tokenId)).to.equal(uri);
  });

  it("Should not allow minting by non-owner", async function () {
    const tokenId = 2;
    const uri = "another-token-uri";

    // Attempt to mint a new token by a non-owner (addr2)
    await expect(quickNodeNFT.connect(addr2).mint(addr2.address, tokenId, uri)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    // Check that the token was not minted
    expect(await quickNodeNFT.ownerOf(tokenId)).to.equal(ethers.constants.AddressZero);
  });
});
