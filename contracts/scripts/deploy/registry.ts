import { ethers } from "hardhat";

async function main() {
  console.log("👟 Start to deploy registry contract");
  const contract = await ethers.deployContract("Registry");
  await contract.waitForDeployment();
  console.log(`✅ Registry contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
