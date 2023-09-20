// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
const lockAddress = "0x5Eb69C0c6cD2B5885e2a4862A303A3759B684C87";
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(
    process.env.GOERLI_PUBLIC_RPC_URL
  );
  const wallet = new ethers.Wallet(process.env.WALEET_PRIVATE_KEY, provider);
  console.log(wallet.address);

  let baseContract = await hre.ethers.getContractFactory("Lock");
  let lock = baseContract.attach(lockAddress).connect(wallet);
  console.log(lock.target, lock.runner);

  // Load the USDC token contract
  const usdcToken = new ethers.Contract(process.env.GOERLI_USDC_ADDRESS, [
    "function approve(address, uint256)",
  ]).connect(wallet);
  console.log(usdcToken.target, usdcToken.runner);

  // Replace these values with the amount and Ethereum address you want to use
  const amountToLock = hre.ethers.parseUnits("10", 6); // Example: Lock 10 USDC with 6 decimal places

  try {
    // Approve the Lock contract to spend USDC tokens on your behalf
    const approveTx = await usdcToken.approve(lockAddress, amountToLock);

    // Wait for the approval transaction to be mined
    await approveTx.wait();

    console.log(`Approved ${amountToLock} USDC for PolyBridge contract`);

    // Call the lockUSDC function
    const lockTx = await lock.lockUSDC(amountToLock);

    // Wait for the lockUSDC transaction to be mined
    await lockTx.wait();

    console.log(`Successfully locked ${amountToLock} USDC`);
  } catch (error) {
    console.error("Error:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
