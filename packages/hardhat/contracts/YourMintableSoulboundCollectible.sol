//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";
//import the 721 contract
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourMintableSoulboundCollectible is ERC721Enumerable, Ownable  {

    mapping(address => bool) public isMinter;
    mapping(uint256 => uint256) public typeOfToken;
    mapping(uint256 => string) public tokenURIByType;

    function updateURI(uint256 tokenType, string memory uri) public onlyOwner {
        tokenURIByType[tokenType] = uri;
    }
    
    function updateMinter(address minter, bool val) public onlyOwner {
        isMinter[minter] = val;
    }
    
    uint256 public supply = 0;

    function mint(address to, uint256 _typeOfToken) public {
        require(msg.sender==owner() || isMinter[msg.sender], "You are not a minter");
        uint256 tokenId = supply++;
        _mint(to, tokenId);
        typeOfToken[tokenId] = _typeOfToken;
    }

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) internal override {
        require(msg.sender==owner() || isMinter[msg.sender], "This is a soulbound collectible");
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);
        return tokenURIByType[typeOfToken[tokenId]];
    }

    function getAllCollectibles(address addr) public view returns( string[] memory){
        uint256 balance = balanceOf(addr);
        string[] memory collectibles = new string[](balance);
        for(uint256 i = 0; i < balance; i++){
            collectibles[i] = tokenURI(tokenOfOwnerByIndex(addr, i));
        }
        return collectibles;
    }
    // Constructor: Called once on contract deployment
    // Check packages/hardhat/deploy/00_deploy_your_contract.ts
    constructor(address _owner) ERC721("YourMintableSoulboundCollectible", "YMSC") {
        isMinter[msg.sender] = true;
        updateURI(0, "https://ipfs.io/ipfs/QmcAvUJDUjunHPe2TZ68dTbAYoGV6QG3san25ymv2z8xCn");
        updateURI(1, "https://ipfs.io/ipfs/QmYLj9sRTdQVBUv7BsA4ro1u2hsgHwXfpK6dtWoJRqSfU8");
        updateURI(2, "https://ipfs.io/ipfs/QmcYXWAoyoccZpYV5m6QHcmb8Z4x2PoUsgY5TVaQMaUssw");
        mint(0x12b313eA9c17c1EDCd5c7303CA6BE1A58Bb47278,0);
        mint(0x12b313eA9c17c1EDCd5c7303CA6BE1A58Bb47278,1);
        mint(0x12b313eA9c17c1EDCd5c7303CA6BE1A58Bb47278,2);
        mint(0x12b313eA9c17c1EDCd5c7303CA6BE1A58Bb47278,1);
        mint(0x12b313eA9c17c1EDCd5c7303CA6BE1A58Bb47278,2);
        transferOwnership(_owner);
    }
}
