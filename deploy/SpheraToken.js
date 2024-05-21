const fs = require("fs")
const hardhat = require("hardhat")
module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    console.log(`>>> your address: ${deployer}`)

    const result = await deploy("SpheraToken", {
        from: deployer,
        args: ["SpheraToken", "SPT"],
        log: true,
        waitConfirmations: 3,
    })

    const content = JSON.parse(fs.readFileSync("./constants/marketplaceArgs.json", "utf-8"))
    content[network.name]["spheraTokenAddress"] = result.address

    fs.writeFileSync("./constants/marketplaceArgs.json", JSON.stringify(content))

    try {
        await hardhat.run("verify:verify", {
            address: result.address,
            constructorArguments: ["SpheraToken", "SPT"],
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.tags = ["SpheraToken"]
