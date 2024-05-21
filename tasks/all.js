const fs = require("fs")
module.exports = async function ({ network }) {
    await run("deploy", {
        tags: "SpheraToken",
        network: network,
    })
    await run("deploy", {
        tags: "SpheraNFT",
        network: network,
    })
    await run("deploy", {
        tags: "NFTMarketplace",
        network: network,
    })
    await run("register", {
        tags: "SpheraToken",
        network: network,
    })
}

module.exports.tags = ["all"]
