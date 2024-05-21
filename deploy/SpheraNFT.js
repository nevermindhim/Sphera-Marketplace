const fs = require("fs")
const hardhat = require("hardhat")

module.exports = async function ({ deployments, network, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    console.log(`>>> your address: ${deployer}`)

    const result = await deploy("SpheraNFT", {
        from: deployer,
        log: true,
        waitConfirmations: 3,
    })

    const content = JSON.parse(fs.readFileSync("./constants/marketplaceArgs.json", "utf-8"))
    content[network.name]["spheraNFTAddress"] = result.address

    fs.writeFileSync("./constants/marketplaceArgs.json", JSON.stringify(content))
    try {
        await hardhat.run("verify:verify", {
            address: result.address,
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.tags = ["SpheraNFT"]
