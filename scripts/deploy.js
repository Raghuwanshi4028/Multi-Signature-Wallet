const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Multi-Signature Wallet to Core Testnet 2...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Define the owners and required confirmations
  // You can modify these addresses as needed
  const owners = [
    deployer.address, // First owner is the deployer
    "0x742d35Cc6634C0532925a3b8D7C44DD8F9cA2D1B", // Example second owner
    "0x8ba1f109551bD432803012645Hac136c5AA548AA", // Example third owner
  ];
  
  const numConfirmationsRequired = 2; // Require 2 out of 3 confirmations

  console.log("Owners:", owners);
  console.log("Required confirmations:", numConfirmationsRequired);

  // Get the contract factory
  const MultiSignatureWallet = await ethers.getContractFactory("MultiSignatureWallet");

  // Deploy the contract
  const multiSigWallet = await MultiSignatureWallet.deploy(owners, numConfirmationsRequired);

  // Wait for deployment to be mined
  await multiSigWallet.waitForDeployment();

  const contractAddress = await multiSigWallet.getAddress();
  console.log("MultiSignatureWallet deployed to:", contractAddress);

  // Verify deployment
  console.log("Verifying deployment...");
  const deployedOwners = await multiSigWallet.getOwners();
  const deployedRequiredConfirmations = await multiSigWallet.numConfirmationsRequired();
  
  console.log("Deployed owners:", deployedOwners);
  console.log("Deployed required confirmations:", deployedRequiredConfirmations.toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: "Core Testnet 2",
    owners: deployedOwners,
    requiredConfirmations: deployedRequiredConfirmations.toString(),
    deploymentTime: new Date().toISOString(),
    deployer: deployer.address,
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("============================\n");

  console.log("Deployment completed successfully!");
  console.log(`You can interact with your contract at: ${contractAddress}`);
  console.log(`View on Core Testnet 2 Explorer: https://scan.test2.btcs.network/address/${contractAddress}`);
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
