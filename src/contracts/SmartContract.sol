
// pragma solidity ^0.8.17;

// import "node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

// contract QuickNodeNFT is ERC721URIStorage, Ownable {
//     constructor(address initialOwner) Ownable(initialOwner) ERC721("QuickNode Shanks", "QNS") {}
    
//     function mint(address _to, uint256 _tokenId, string calldata _uri) external onlyOwner {
//         _mint(_to, _tokenId);
//         _setTokenURI(_tokenId, _uri);
//     }
// }


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract MyNFTCollection is ERC721, Ownable {
    constructor() ERC721("MyNFTCollection", "MNC") {}

    function mint() external onlyOwner {
        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);
    }
}

