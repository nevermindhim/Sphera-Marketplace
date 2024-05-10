const fs = require("fs")
module.exports = async function (deployments, taskArgs, hre) {
    const content = JSON.parse(fs.readFileSync("./constants/marketplaceArgs.json", "utf-8"))

    const networkName = taskArgs.network.name
    const nftMarketplaceAddress = content[networkName]["nftMarketplaceAddress"]
    const nftMarketplaceFactory = await ethers.getContractFactory("NFTMarketplace")
    const nftMarketplaceContract = nftMarketplaceFactory.attach(nftMarketplaceAddress)

    await nftMarketplaceContract.setTreasuryWalletAddress(content[networkName]["treasuryWalletAddress"])
    await nftMarketplaceContract.registerSpheraToken(content[networkName]["spheraTokenAddress"])
}
