module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    console.log(`>>> your address: ${deployer}`)

    await deploy("NFTMarketplace", {
        from: deployer,
        log: true,
        waitConfirmations: 3,
    })
    await hre.run("verifyContract", { contract: "NFTMarketplace" })
}

module.exports.tags = ["NFTMarketplace"]
