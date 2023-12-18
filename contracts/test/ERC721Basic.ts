import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC721Basic", function () {
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
    const erc721ContractFactory = await ethers.getContractFactory(
      "ERC721Basic"
    );
    const erc721Contract = await erc721ContractFactory
      .connect(userOne)
      .deploy(
        "TestToken",
        "TT",
        registryContract.getAddress(),
        ethers.ZeroAddress
      );
    // Check registry
    expect(await registryContract.getTokens(userOne)).includes(
      await erc721Contract.getAddress()
    );
    expect(
      await registryContract.getTokenType(await erc721Contract.getAddress())
    ).is.equal("ERC721_EXTENDED");
  });
});
