// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9; 

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";

contract Puff is ERC721A, Ownable, ReentrancyGuard, DefaultOperatorFilterer {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = ".json";
  string public notRevealedUri  ; 

  uint256 public PublicMintCost = 0.01 ether;

  uint256 public maxSupply = 335;
  uint256 public MaxperWallet_PublicMint = 4;
    uint256 public MaxperWallet_SpecialMint = 1;
 
  bool public paused = false; 
  bool public revealed = true;
  bool public PublicMint_Live = true;
  
   mapping(address => uint256) public walletMintCounts;
   mapping(address => uint256) public walletMaxMintDate;
   mapping(address => uint256) public walletSpecialNFTClaimDate;

  constructor(
    string memory _initBaseURI
  ) ERC721A("Puff", "Puff") {
    setBaseURI(_initBaseURI);
    
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }
  
  function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
  }
    
   //Operator Filter
    function setApprovalForAll(address operator, bool approved) public override onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, approved);
    }

    function approve(address operator, uint256 tokenId) public payable override onlyAllowedOperatorApproval(operator) {
        super.approve(operator, tokenId);
    }
    function transferFrom(address from, address to, uint256 tokenId)
        public
        payable
             override
        onlyAllowedOperator(from)
    {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId)
        public
        payable
           override
        onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)
        public
        payable
          override
        onlyAllowedOperator(from)
    {
        super.safeTransferFrom(from, to, tokenId, data);
    }


/// @dev  Public Mint
  function PublicMint(uint256 tokens) public payable nonReentrant {
    require(!paused, "oops contract is paused");
    require(PublicMint_Live, "Sale Hasn't started yet");
    uint256 supply = totalSupply();
    require(tokens > 0, "need to mint at least 1 NFT");
    require(supply + tokens <= maxSupply, "We Soldout");
    require(_numberMinted(_msgSender()) + tokens <= MaxperWallet_PublicMint , " Max NFTs Per Wallet exceeded");
    require(msg.value >= PublicMintCost * tokens, "insufficient funds");


      _safeMint(_msgSender(), tokens);
      walletMintCounts[msg.sender]++;

        if (walletMintCounts[msg.sender] == MaxperWallet_PublicMint) {
            walletMaxMintDate[msg.sender] = block.timestamp;
            walletSpecialNFTClaimDate[msg.sender] = block.timestamp + 31536000 ;
        }
    
  }
  
  /// @dev Mint Special NFT after 1 year
  
  function mintSpecialNFT( uint256 tokens ) public {
        require(walletSpecialNFTClaimDate[msg.sender] != 0, "User has not minted max NFTs in previous phase");
        require(block.timestamp >= walletSpecialNFTClaimDate[msg.sender], "Special NFT cannot be claimed yet");
        uint256 supply = totalSupply();
        require(tokens > 0, "need to mint at least 1 NFT");
        require(supply + tokens <= maxSupply, "We Soldout");
        require(_numberMinted(_msgSender()) + tokens <= MaxperWallet_PublicMint + MaxperWallet_SpecialMint , " Max NFTs Per Wallet exceeded");

        _safeMint(msg.sender, tokens);
    }

  /// @dev use it for giveaway and mint for yourself
     function gift(uint256 _mintAmount, address destination) public onlyOwner nonReentrant {
    uint256 supply = totalSupply();
    require(supply + _mintAmount <= maxSupply, "Soldout");

      _safeMint(destination, _mintAmount);
    
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721AMetadata: URI query for nonexistent token"
    );
    
    if(revealed == false) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

    function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }
  
   function getWalletSpecialNFTClaimDate( address owner) public view returns (uint256) {
    return walletSpecialNFTClaimDate[owner];
}

  //only owner
  function reveal(bool _state) public onlyOwner {
      revealed = _state;
  }


  
  function setMaxperWallet_PublicMint(uint256 _limit) public onlyOwner {
    MaxperWallet_PublicMint = _limit;
  }
  
   function setMaxperWallet_SpecialMint(uint256 _limit) public onlyOwner {
    MaxperWallet_SpecialMint = _limit;
  }

  function setPublicMintCost(uint256 _newCost) public onlyOwner {
    PublicMintCost = _newCost;
  }


    function setMaxsupply(uint256 _newsupply) public onlyOwner {
    maxSupply = _newsupply;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }
  
  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedUri = _notRevealedURI;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

  function toggle_PublicMint_Live(bool _state) external onlyOwner {
        PublicMint_Live = _state;
    }

 
  function withdraw() public payable onlyOwner nonReentrant {
    (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(success);
  }
}
