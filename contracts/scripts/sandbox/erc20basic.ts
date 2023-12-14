import { ethers } from "hardhat";
import { Registry } from "../../typechain-types";

const SFS_ADDRESS = "0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6"; // Only for mode testnet
const REGISTRY_ADDRESS = "0xD9fEAbe16BAb684B5537eb6cbB43C8A4e6a90F47";

async function main() {
  console.log("👟 Sandbox started");
  // Define signer
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  // Define registry contract
  const registryFactory = await ethers.getContractFactory("Registry");
  const registryContract = registryFactory.attach(REGISTRY_ADDRESS) as Registry;
  // Check contracts in registry
  console.log(
    "deployer contracts",
    await registryContract.getContracts(deployerAddress)
  );
  // // Deploy erc20basic contract
  // const erc20ContractFactory = await ethers.getContractFactory("ERC20Basic");
  // const erc20Contract = await erc20ContractFactory.deploy(
  //   "TestToken",
  //   "TT",
  //   42,
  //   registryContract.getAddress(),
  //   SFS_ADDRESS
  // );
  // await erc20Contract.waitForDeployment();
  // console.log("erc20contract", await erc20Contract.getAddress());
  // // Check contracts in registry
  // console.log(
  //   "deployer contracts",
  //   await registryContract.getContracts(deployerAddress)
  // );
  console.log("✅ Sandbox finished");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
