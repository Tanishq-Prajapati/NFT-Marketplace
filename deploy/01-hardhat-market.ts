import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { development_chains } from "../helper-hardhat-config";
import verifyContract from "../utility/verify";


const main: DeployFunction =
    async (hre: HardhatRuntimeEnvironment) => {
        // deploying the market Contract here
        const { network, deployments, getNamedAccounts } = hre;
        const { deployer } = await getNamedAccounts();
        const { deploy } = deployments;

        console.log("Deploying the NFT-Marketplace...");

        // deploying the contract here
        let Market = await deploy('MarketPlace', {
            from: deployer,
            log: true,
            waitConfirmations: 1,
            args: []
        });

        console.log("========== NFT MARKETPLACE DEPLOYED ==========");

        // now verying the contract here
        if (!development_chains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
            // verying the contract here
            console.log("Testnet Detected...");
            await verifyContract(Market.address, []);
        }
    }

main.tags = ['all', 'market'];
export default main;