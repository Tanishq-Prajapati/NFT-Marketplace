import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "@nomiclabs/hardhat-waffle";
import dotenv from "dotenv";
import { GANACHE_DESKTOP_KEYS, GANACHE_PRVT_KEYS } from "./helper-hardhat-config";
dotenv.config();

// importing the ENV VARS here
let SEPOLIA_RPC_URL: string = process.env.SEPOLIA_NETWORK_RPC_URL as string;
let SEPOLIA_CHAIN_ID: number | undefined = process.env.SEPOLIA_CHAIN_ID ? parseInt(process.env.SEPOLIA_CHAIN_ID) : undefined;
let SEPOLIA_PRIVATE_KEY: string = process.env.ACCOUNT_PRIVATE_KEY as string;

// ENV VARS for localnetworks
let GANACHE_RPC_URL = process.env.GANACHE_NETWORK_RPC_URL;
let GANACHE_CHAIN_ID: number | undefined = process.env.GANACHE_CHAIN_ID ? parseInt(process.env.GANACHE_CHAIN_ID) : undefined;
let GANACHE_ACCOUNTS = GANACHE_PRVT_KEYS;

// ETHERSCAN API KEY
let ETHERSCAN_VERIFY: string = process.env.ETHERSCAN_API_KEY as string;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20"
      },
      {
        version: "0.8.24"
      }
    ]
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: SEPOLIA_CHAIN_ID
    },
    ganache: {
      url: GANACHE_RPC_URL,
      accounts: [...GANACHE_ACCOUNTS],
      chainId: GANACHE_CHAIN_ID
    }
  },
  defaultNetwork: "ganache",
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  verify:{
    etherscan:{
      apiKey: ETHERSCAN_VERIFY
    }
  }
};

export default config;