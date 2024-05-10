const fs = require("fs")
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
    content["spheraTokenAddress"] = result.address

    fs.writeFileSync("./constants/marketplaceArgs.json", JSON.stringify(content))

    await hardhat.run("verify:verify", {
        address: result.address,
    })
}

module.exports.tags = ["SpheraToken"]
