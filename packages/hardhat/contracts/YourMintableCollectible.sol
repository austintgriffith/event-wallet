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
contract YourMintableCollectible is ERC721Enumerable, Ownable  {

    mapping(uint256 => uint256) public typeOfToken;
    mapping(uint256 => string) public tokenURIByType;

    function updateURI(uint256 tokenType, string memory uri) public onlyOwner {
        tokenURIByType[tokenType] = uri;
    }
    
    uint256 public supply = 0;

    function mint(uint256 _typeOfToken) public {
        uint256 tokenId = supply++;
        _mint(msg.sender, tokenId);
        typeOfToken[tokenId] = _typeOfToken;
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
        updateURI(0, "https://ipfs.io/ipfs/QmXhtKdR8NFQp6ngea81uG8GyBSfn1UUmdKXBNrrv5MvA8");
        //mint(0x12b313eA9c17c1EDCd5c7303CA6BE1A58Bb47278,0);
        //mint(0x12b313eA9c17c1EDCd5c7303CA6BE1A58Bb47278,0);
        transferOwnership(_owner);
    }
}
