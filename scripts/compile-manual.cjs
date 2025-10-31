const solc = require('solc');
const fs = require('fs');
const path = require('path');

// Read the contract source
const contractPath = path.join(__dirname, '..', 'contracts', 'MyToken.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// Prepare the input for the Solidity compiler
const input = {
  language: 'Solidity',
  sources: {
    'MyToken.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    },
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

console.log('Compiling contract...');

// Import callback for resolving dependencies
function findImports(importPath) {
  try {
    // Handle OpenZeppelin imports
    if (importPath.startsWith('@openzeppelin/')) {
      const fullPath = path.join(__dirname, '..', 'node_modules', importPath);
      return { contents: fs.readFileSync(fullPath, 'utf8') };
    }
    return { error: 'File not found' };
  } catch (e) {
    return { error: 'File not found' };
  }
}

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

// Check for errors
if (output.errors) {
  output.errors.forEach(error => {
    console.error(error.formattedMessage);
  });
  
  const hasErrors = output.errors.some(error => error.severity === 'error');
  if (hasErrors) {
    process.exit(1);
  }
}

// Extract the compiled contract
const contract = output.contracts['MyToken.sol']['MyToken'];

if (!contract) {
  console.error('Contract not found in compilation output');
  process.exit(1);
}

// Create utils directory if it doesn't exist
const utilsDir = path.join(__dirname, '..', 'src', 'utils');
if (!fs.existsSync(utilsDir)) {
  fs.mkdirSync(utilsDir, { recursive: true });
}

// Write ABI
const abiPath = path.join(utilsDir, 'MyToken.json');
fs.writeFileSync(abiPath, JSON.stringify(contract.abi, null, 2));
console.log('ABI written to:', abiPath);

// Write bytecode
const bytecodePath = path.join(utilsDir, 'MyTokenBin.json');
const bytecodeData = { 
  bytecode: '0x' + contract.evm.bytecode.object 
};
fs.writeFileSync(bytecodePath, JSON.stringify(bytecodeData, null, 4));
console.log('Bytecode written to:', bytecodePath);

console.log('Compilation complete!');
console.log('Contract size:', contract.evm.bytecode.object.length / 2, 'bytes');