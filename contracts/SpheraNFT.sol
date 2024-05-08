// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SpheraNFT is ERC721 {
    // Error Codes
    uint totalCount = 0;
    constructor() ERC721("Sphera", "SPH") {}

    function issueToken() public {
        _mint(msg.sender, totalCount++);
    }
}
