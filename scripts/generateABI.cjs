const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Compiling contracts...");
  
  // Compile the contracts
  await hre.run("compile");
  
  // Get the contract artifact
  const contractName = "MyToken";
  const artifact = await hre.artifacts.readArtifact(contractName);
  
  // Extract ABI and bytecode
  const abi = artifact.abi;
  const bytecode = artifact.bytecode;
  
  // Create utils directory if it doesn't exist
  const utilsDir = path.join(__dirname, "..", "src", "utils");
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  // Write ABI to file
  const abiPath = path.join(utilsDir, "MyToken.json");
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
  console.log("ABI written to:", abiPath);
  
  // Write bytecode to file
  const bytecodePath = path.join(utilsDir, "MyTokenBin.json");
  const bytecodeData = { bytecode: bytecode };
  fs.writeFileSync(bytecodePath, JSON.stringify(bytecodeData, null, 4));
  console.log("Bytecode written to:", bytecodePath);
  
  console.log("Contract compilation and ABI/bytecode generation complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });