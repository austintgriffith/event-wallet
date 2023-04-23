//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";
//import the 721 contract
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourCollectible is ERC721, Ownable {

    mapping(address => bool) public isMinter;
    
    function updateMinter(address minter, bool val) public onlyOwner {
        isMinter[minter] = val;
    }
    
    uint256 public supply = 0;

    function mint(address to) public {
        require(msg.sender==owner() || isMinter[msg.sender], "You are not a minter");
        _mint(to, supply++);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);
        return 'https://ipfs.io/ipfs/QmWEfDCbjd6jxNz3H6fE1b6RSSFLXrZbNgLrkhehatVEqp';
    }

    // Constructor: Called once on contract deployment
    // Check packages/hardhat/deploy/00_deploy_your_contract.ts
    constructor(address _owner) ERC721("YourCollectible", "YCOL") {
        transferOwnership(_owner);
    }

}
