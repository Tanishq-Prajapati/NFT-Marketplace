//SPDX-License-Identifier:MIT
pragma solidity ^0.8.24;

// importing the IERC721 here
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

// creating all the Errors here
error MarketPlace__NotNftOwner();
error MarketPlace__NFTNotListed();
error MarketPlace__NFTAlreadyListed();
error MarketPlace__NFTPriceNotZero();
error MarketPlace__NotAuthorizedNFT();
error MarketPlace__PriceNotMet();
error MarketPlace__NotFunds();
error MarketPlace__FundsWithdrawFail();

contract MarketPlace{
    // creating the state variables here
    struct Listing {
        uint256 price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    enum List {
        MUST_HAVE,
        MUST_NOT_HAVE
    }

    // now creating important variables here
    address private immutable owner;

    // creating all the mappings here
    mapping(address => mapping(uint256 => Listing)) nftListing;
    mapping(address => uint256) withDrawProceeds;

    constructor() {
        owner = msg.sender;
    }

    // creating the Modifiers here
    modifier isNFTOwner(
        address nftContractAddress,
        uint256 tokenID,
        address spender
    ) {
        IERC721 nftContract = IERC721(nftContractAddress);
        address nftOwner = nftContract.ownerOf(tokenID);
        if (nftOwner != spender) {
            // error detected here
            revert MarketPlace__NotNftOwner();
        }
        _;
    }

    modifier isNFTListed(
        address nftContractAddress,
        uint256 tokenID,
        List checkType
    ) {
        if (checkType == List.MUST_HAVE) {
            if (nftListing[nftContractAddress][tokenID].price <= 0) {
                revert MarketPlace__NFTNotListed();
            }
            _;
            return;
        }
        if (nftListing[nftContractAddress][tokenID].price > 0) {
            revert MarketPlace__NFTAlreadyListed();
        }
        _;
        return;
    }

    // creating the main Important Functions here
    function listNFT(
        address nftContractAddr,
        uint256 tokenID,
        uint256 price
    )
        external
        isNFTListed(nftContractAddr, tokenID, List.MUST_NOT_HAVE)
        isNFTOwner(nftContractAddr, tokenID, msg.sender)
    {
        // checking the price of the NFT here
        if (price <= 0) {
            revert MarketPlace__NFTPriceNotZero();
        }

        // now approving the nFT here
        IERC721 nftContract = IERC721(nftContractAddr);
        if (nftContract.getApproved(tokenID) != address(this)) {
            revert MarketPlace__NotAuthorizedNFT();
        }
        nftListing[nftContractAddr][tokenID] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftContractAddr, tokenID, price);
    }

    // creating a function to buy the NFt here
    function buyNFT(
        address nftContractAddress,
        uint256 tokenID
    )
        external
        payable
        isNFTListed(nftContractAddress, tokenID, List.MUST_HAVE)
        returns(bool)
    {
        Listing memory listedNFT = nftListing[nftContractAddress][tokenID];
        if (msg.value < listedNFT.price) {
            revert MarketPlace__PriceNotMet();
        }

        // now making the proceeds high for the seller
        console.log(listedNFT.seller, "GODDDD\n");
        withDrawProceeds[listedNFT.seller] += msg.value;
        // now also deleting the listing here
        delete (nftListing[nftContractAddress][tokenID]);
        IERC721(nftContractAddress).safeTransferFrom(
            listedNFT.seller,
            msg.sender,
            tokenID
        );
        emit ItemBought(
            msg.sender,
            nftContractAddress,
            tokenID,
            listedNFT.price
        );
    }

    // Cancelling the listing of the NFT here
    function cancelNFTListing(
        address nftContractAddress,
        uint256 tokenID
    )
        external
        isNFTOwner(nftContractAddress, tokenID, msg.sender)
        isNFTListed(nftContractAddress, tokenID, List.MUST_HAVE)
    {
        delete (nftListing[nftContractAddress][tokenID]);
        emit ItemCanceled(msg.sender, nftContractAddress, tokenID);
    }

    // creating a function that will update the listing of NFT
    function updateNFTListing(
        address nftContractAddr,
        uint256 tokenID,
        uint256 price
    )
        external
        isNFTOwner(nftContractAddr, tokenID, msg.sender)
        isNFTListed(nftContractAddr, tokenID, List.MUST_HAVE)
    {
        // now checking the latest price must not be zero
        if (price <= 0) {
            revert MarketPlace__PriceNotMet();
        }

        // now checking and updating the listing here
        nftListing[nftContractAddr][tokenID].price = price;
        emit ItemListed(msg.sender, nftContractAddr, tokenID, price);
    }

    // creating a function for withdraw the buyed NFT'S ETHER'S
    function withdrawFunds() external {
        uint256 sellerFunds = withDrawProceeds[msg.sender];
        if (sellerFunds <= 0) {
            revert MarketPlace__NotFunds();
        }

        // now changing the state and sending the funds
        withDrawProceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: sellerFunds}("");
        if (!success) {
            revert MarketPlace__FundsWithdrawFail();
        }
    }

    // gettign the listed item here
    function getListedItem(
        address nftContractAddress,
        uint256 tokenID
    ) external view returns (Listing memory) {
        return nftListing[nftContractAddress][tokenID];
    }

    // function get withdraw amount here
    function getWithdrawFunds() external view returns(uint256){
        return withDrawProceeds[msg.sender];
    }
}
