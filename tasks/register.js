const fs = require("fs")
module.exports = async function (deployments, hre) {
    const content = JSON.parse(fs.readFileSync("./constants/marketplaceArgs.json", "utf-8"))

    const nftMarketplaceAddress = content["nftMarketplaceAddress"]
    const nftMarketplaceFactory = await ethers.getContractFactory("NFTMarketplace")
    const nftMarketplaceContract = nftMarketplaceFactory.attach(nftMarketplaceAddress)

    await nftMarketplaceContract.setTreasuryWalletAddress(content["treasuryWalletAddress"])
    await nftMarketplaceContract.registerSpheraToken(content["spheraTokenAddress"])
}
