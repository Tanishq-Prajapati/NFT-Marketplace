import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { development_chains } from "../helper-hardhat-config";
import verifyContract from "../utility/verify";

const main: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    //deploying the basic-NFT here
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log("Deploying Basic NFT...");
    
    // now deploying the main here
    let BasicNFTContract = await deploy(
        'BasicNFT',
        {
            from: deployer,
            log: true,
            args: [
                "Pugie", "PUG"
            ],
            waitConfirmations: 1
        }
    )

    console.log("========== BASIC NFT DEPLOYED ==========");    

    // now verifying the contract if in the testnet
    if (!development_chains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY) {
        console.log("Testnet Detected...");
        await verifyContract(BasicNFTContract.address, ["Pugie", "PUG"])
    }
}

main.tags = ['all', 'basic'];
export default main;