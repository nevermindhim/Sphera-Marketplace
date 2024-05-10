const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("NFTMarketplace", function () {
    let NFTMarketplace, nftMarketplace, owner, addr1, addr2

    beforeEach(async function () {
        // Deploy the NFTMarketplace contract
        NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
        ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
        nftMarketplace = await NFTMarketplace.deploy()
        await nftMarketplace.deployed()
    })

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await nftMarketplace.contractOwner()).to.equal(owner.address)
        })
    })

    describe("Listing and Unlisting NFTs", function () {
        it("Should list an NFT", async function () {
            // Assuming you have an ERC721 token deployed and minted
            const token = await ethers.getContractAt("IERC721", "TOKEN_ADDRESS")
            const tokenId = 1 // Example token ID
            await token.connect(owner).approve(nftMarketplace.address, tokenId)
            await nftMarketplace.connect(owner).listNFT([token.address], [tokenId], [100])
            expect(await nftMarketplace.nfts(formatNftId(token.address, tokenId))).to.exist
        })

        it("Should unlist an NFT", async function () {
            // Assuming you have an ERC721 token deployed and minted
            const token = await ethers.getContractAt("IERC721", "TOKEN_ADDRESS")
            const tokenId = 1 // Example token ID
            await token.connect(owner).approve(nftMarketplace.address, tokenId)
            await nftMarketplace.connect(owner).unlistNFT(token.address, tokenId)
            expect(await nftMarketplace.nfts(formatNftId(token.address, tokenId)).isListed()).to.be.false
        })
    })
})
