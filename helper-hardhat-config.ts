import { parseEther } from "ethers";

interface Contract {
    name: string;
    aggregator_address: string;
    vrfAddress: string | null;
    keyHash: string;
    maxEntranceCount: number;
    entranceFee: number;
    numWords: string;
    nishaqInterval: string;
    callBackGasLimit: string;
    subscription_id?: number
}

interface ContractMap {
    [key: number]: Contract;
}

const netowrkconfig: ContractMap = {
    11155111: {
        name: "Sepolia",
        aggregator_address: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        vrfAddress: "",
        keyHash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        maxEntranceCount: 5,
        entranceFee: 50,
        numWords: "1",
        nishaqInterval: "15",
        callBackGasLimit: "500000",
        subscription_id:0
    },
    1337: {
        name: "hardhat",
        aggregator_address: "",
        vrfAddress: null,
        keyHash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        maxEntranceCount: 5,
        entranceFee: 50,
        numWords: "1",
        nishaqInterval: "15",
        callBackGasLimit: "500000"
    }
}
const fundMeErrors = {
    NOT_ENOUGH_FUNDS: "Insufficient Funds",
    NOT_ENOUGH_SLOTS: "Insufficient Slots"
}

const GANACHE_PRVT_KEYS = [
    "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
    "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
    "0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c",
    "0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913",
    "0xadd53f9a7e588d003326d1cbf9e4a43c061aadd9bc938c843a79e7b4fd2ad743",
    "0x395df67f0c2d2d9fe1ad08d1bc8b6627011959b79c53d7dd6a3536a33ab8a4fd",
    "0xe485d098507f54e7733a205420dfddbe58db035fa577fc294ebd14db90767a52",
    "0xa453611d9419d0e56f499079478fd72c37b251a94bfde4d19872c44cf65386e3",
    "0x829e924fdf021ba3dbbc4225edfece9aca04b929d6e75613329ca6f1d31c0bb4",
    "0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773"
]

const GANACHE_DESKTOP_KEYS = [
    "0x970a1b4389d799ef54ceeea86850af0410ac2df616cba709f0b450be7de93c98",
    "0x292dac11c6f9da2e0550c3d01c10be7f7bd73a23bbed5d5bbdb590226794c7ef",
    "0x28f912e635c3d62e72d7df28ec786da8c9d6a4d24fad822e4da5482610319851"
]

const development_chains = [
    "hardhat",
    "localhost",
    "ganache",
    "ganacheDesktop"
]

const FUNDME_ENTRANCE_FEE_USD = 5;

const MOCK_ARGS = {
    vrf: {
        BASE_FEE: parseEther("0.25"),
        GAS_PRICE_LINK: 1e9
    },
    aggregator: {
        MOCK_DECIMALS: 8,
        MOCK_PRICE: 200000000000
    }
}

export {
    netowrkconfig,
    fundMeErrors,
    GANACHE_PRVT_KEYS,
    development_chains,
    FUNDME_ENTRANCE_FEE_USD,
    MOCK_ARGS,
    ContractMap,
    GANACHE_DESKTOP_KEYS
}