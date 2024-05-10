const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Deploy Contracts", function () {
    let spheraToken, spheraNFT, nftMarketplace
    let owner, addr1, addr2
    beforeEach(async function () {
        // Deploy ERC20 contract

        ;[owner, addr1, addr2, addr3] = await ethers.getSigners()

        const SpheraTokenFactory = await ethers.getContractFactory("SpheraToken")
        spheraToken = await SpheraTokenFactory.deploy("SpheraToken", "SPT")
        await spheraToken.deployed()

        // Deploy SpheraNFT contract
        const SpheraNFTFactory = await ethers.getContractFactory("SpheraNFT")
        spheraNFT = await SpheraNFTFactory.deploy()
        await spheraNFT.deployed()

        // Deploy NFTMarketplace contract
        const NFTMarketplaceFactory = await ethers.getContractFactory("NFTMarketplace")
        nftMarketplace = await NFTMarketplaceFactory.deploy()
        await nftMarketplace.deployed()

        console.log("SpheraToken deployed to:", spheraToken.address)
        console.log("SpheraNFT deployed to:", spheraNFT.address)
        console.log("NFTMarketplace deployed to:", nftMarketplace.address)

        await spheraNFT.connect(addr1).issueToken()
        await spheraToken.connect(addr2).issueToken(addr2.address, 10000)
        await spheraToken.connect(addr3).issueToken(addr3.address, 10000)

        await nftMarketplace.registerSpheraToken(spheraToken.address)
        await nftMarketplace.setTreasuryWalletAddress(owner.address)
    })

    it("Should list an NFT", async function () {
        await spheraNFT.connect(addr1).approve(nftMarketplace.address, 0)
        await expect(nftMarketplace.connect(addr1).listNFT([spheraNFT.address], [0], [5000]))
            .to.emit(nftMarketplace, "ListNFT")
            .withArgs(spheraNFT.address, 0, addr1.address, 5000)
    })

    it("Should fail listing an NFT", async function () {
        await expect(nftMarketplace.connect(addr1).listNFT([spheraNFT.address], [1], [5000])).revertedWith("ERC721: invalid token ID")
        await expect(nftMarketplace.connect(addr1).listNFT([spheraNFT.address], [0], [5000])).revertedWith(
            "The Contract doesn't have allowance for this token"
        )
    })

    it("Should unlist NFTs", async function () {
        await spheraNFT.connect(addr1).approve(nftMarketplace.address, 0)
        await nftMarketplace.connect(addr1).listNFT([spheraNFT.address], [0], [5000])
        await expect(nftMarketplace.connect(addr1).unlistNFT(spheraNFT.address, 0))
            .to.emit(nftMarketplace, "UnlistNFT")
            .withArgs(spheraNFT.address, 0, addr1.address, 5000)
    })

    it("Should add Bids", async function () {
        await spheraNFT.connect(addr1).approve(nftMarketplace.address, 0)
        await nftMarketplace.connect(addr1).listNFT([spheraNFT.address], [0], [5000])

        await spheraToken.connect(addr2).approve(nftMarketplace.address, 3000)
        await expect(nftMarketplace.connect(addr2).addBid(spheraNFT.address, 0, 3000))
            .to.emit(nftMarketplace, "AddBid")
            .withArgs(spheraNFT.address, 0, addr1.address, addr2.address, 3000)
    })

    it("Should remove Bids", async function () {
        await spheraNFT.connect(addr1).approve(nftMarketplace.address, 0)
        await nftMarketplace.connect(addr1).listNFT([spheraNFT.address], [0], [5000])

        await spheraToken.connect(addr2).approve(nftMarketplace.address, 3000)
        await nftMarketplace.connect(addr2).addBid(spheraNFT.address, 0, 3000)

        await nftMarketplace.connect(addr2).deleteBid(spheraNFT.address, 0, addr2.address)
    })

    it("Should buy NFTs", async function () {
        await spheraNFT.connect(addr1).approve(nftMarketplace.address, 0)
        await nftMarketplace.connect(addr1).listNFT([spheraNFT.address], [0], [5000])

        await spheraToken.connect(addr3).approve(nftMarketplace.address, 3000)
        await nftMarketplace.connect(addr3).addBid(spheraNFT.address, 0, 3000)

        expect(await spheraNFT.ownerOf(0)).equal(addr1.address)
        expect(await spheraToken.balanceOf(addr1.address)).equal(0)
        expect(await spheraToken.balanceOf(addr3.address)).equal(7000)

        await spheraToken.connect(addr2).approve(nftMarketplace.address, 6000)
        await nftMarketplace.connect(addr2).addBid(spheraNFT.address, 0, 6000)

        expect(await spheraNFT.ownerOf(0)).equal(addr2.address)
        expect(await spheraToken.balanceOf(addr1.address)).equal(6000)
        expect(await spheraToken.balanceOf(addr3.address)).equal(10000)
    })
})
