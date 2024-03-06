// importing the important libraries and properties
import {assert, expect} from "chai";
import {
    network,
    deployments,
    ethers
} from "hardhat";

import { development_chains } from "../helper-hardhat-config";
import { Contract, ContractRunner, Signer } from "ethers";

!development_chains.includes(network.name)
    ? describe.skip
    : describe('MarketPlace', () => {
        let deployer: Signer;
        let MarketplaceContract: Contract;
        let marketAddr: string, BasicNFTAddr: string;
        let BasicNFTContract: Contract;
        let otherAccounts: Signer[];
        let PRICE = ethers.parseEther("0.1");
        let TOKENID = 0;
        beforeEach(async()=>{
            // getting all the vars and values here
            [deployer, ...otherAccounts] = (await ethers.getSigners())
            // deploying the fixtures here
            await deployments.fixture(['all']);
            // getting the deployed contracts here
            MarketplaceContract = await ethers.getContract('MarketPlace', deployer);
            marketAddr = await MarketplaceContract.getAddress()
            console.log(marketAddr);

            BasicNFTContract = await ethers.getContract('BasicNFT', deployer);
            BasicNFTAddr = await BasicNFTContract.getAddress();
        })

        it("Mint => List => Buy", async()=>{
            // minting the NFT's here 
            await BasicNFTContract.mintDOG();
            console.log("Mint Completed...");
            
            // now approving the BasicNftContract to nft give access to market
            let contrastTransac = await BasicNFTContract.setApprovalForAll(marketAddr, true);
            let transacReciept = await contrastTransac.wait(1);
            console.log(transacReciept.logs);

            await BasicNFTContract.approve(marketAddr, TOKENID);
            console.log("Giving access Completed...");

            // now listing the NFT
            await MarketplaceContract.listNFT(
                BasicNFTAddr,
                TOKENID,
                PRICE
            );
            console.log("Listing NFT Completed...");
            // now getting the nft from listing here
            let nft = await MarketplaceContract.getListedItem(BasicNFTAddr, TOKENID);
            console.log(nft, "MY NFT");
            // now making someone to buy that NFT from MarketPlace
            let player2 = otherAccounts[1];
            let player2Addr = await player2.getAddress();
            let MarketplaceContract2: Contract = MarketplaceContract.connect(player2) as Contract;
            console.log("Till here its Great");
            
            // checking if the contract working write or wrong
            console.log(await MarketplaceContract2.getListedItem(BasicNFTAddr, TOKENID));

            await MarketplaceContract2.buyNFT(
                BasicNFTAddr, 
                TOKENID,
                {
                    value: PRICE
                }
            );
            console.log("BUYED NFT...");
            
            // now checking the owner of the NFT here
            let newOwner = await BasicNFTContract.ownerOf(TOKENID);
            assert.equal(newOwner, player2Addr);
            // now gettting the withDrawAmount he/she was having
            let withDrawAMO = await MarketplaceContract.getWithdrawFunds();
            assert.equal(withDrawAMO, PRICE);
            // now Withdrawing the amount here
            await MarketplaceContract.withdrawFunds();
            // now checking again for the withDraw amount is Zero or not
            let withDrawAMO2 = await MarketplaceContract.getWithdrawFunds();
            assert.equal(withDrawAMO2, 0);
        })
    })