import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20Basic", function () {
  async function initFixture() {
    // Get signers
    const [deployer, userOne, userTwo, userThree] = await ethers.getSigners();
    // Deploy registry
    const registryContractFactory = await ethers.getContractFactory("Registry");
    const registryContract = await registryContractFactory.deploy();
    // Return data
    return {
      deployer,
      userOne,
      userTwo,
      userThree,
      registryContract,
    };
  }

  it("Should support the main flow", async function () {
    const { userOne, registryContract } = await loadFixture(initFixture);
    // Deploy contract
    const erc20ContractFactory = await ethers.getContractFactory("ERC20Basic");
    const erc20Contract = await erc20ContractFactory
      .connect(userOne)
      .deploy(
        "TestToken",
        "TT",
        42,
        registryContract.getAddress(),
        ethers.ZeroAddress
      );
    // Check registry
    expect(await registryContract.getContracts(userOne)).includes(
      await erc20Contract.getAddress()
    );
  });
});
