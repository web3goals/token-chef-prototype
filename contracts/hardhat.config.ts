import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    modeTestnet: {
      url: "https://sepolia.mode.network",
      chainId: 919,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
