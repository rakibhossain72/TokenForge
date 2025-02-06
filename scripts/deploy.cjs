const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  
  // Deploy the contract
  const tokenFactory = await TokenFactory.deploy();
  
  // Wait for deployment to complete
  await tokenFactory.waitForDeployment();

  // Get the deployed contract address
  const tokenFactoryAddress = await tokenFactory.getAddress();
  
  console.log("TokenFactory deployed to:", tokenFactoryAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await tokenFactory.deploymentTransaction().wait(5);
  
  console.log("Contract deployed and confirmed!");

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: tokenFactoryAddress,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan!");
  } catch (error) {
    console.log("Error verifying contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });