"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import {} from "ethers";
import usdcAbi from "../../smart_contracts/artifacts/contracts/USDCTestToken.sol/USDCTestToken.json";
import lockAbi from "../../smart_contracts/artifacts/contracts/Lock.sol/Lock.json";
import { useAccount } from "wagmi";

const usdcAddress = "0xc493e7373757C759cf589731eE1cFaB80b13Ed7a";
const lockAddress = "0x42e16E0fb372a48b9E767ed00B120748349f288F";

export default function Home() {
  const { address, isConnected } = useAccount();

  const [faucetAmount, setFaucetAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [walletUSDCAmount, setWalletUSDCAmount] = useState(0);
  const [depositedUSDCAmount, setDepositedUSDCAmount] = useState(0);
  const [status, setStatus] = useState("");
  const [lock, setLock] = useState(null);
  const [usdcToken, setUdscToken] = useState(null);

  const updateBlance = async () => {
    const usdcBalance = await usdcToken.balanceOf(address);
    console.log(`USDC Balance: ${ethers.formatUnits(usdcBalance, 6)}`); // USDC has 6 decimal places
    setWalletUSDCAmount(ethers.formatUnits(usdcBalance, 6));
    const depoisited = await lock.getDepositedAmount(address);
    console.log(`USDC Balance: ${ethers.formatUnits(depoisited, 6)}`); // USDC has 6 decimal places
    setDepositedUSDCAmount(ethers.formatUnits(depoisited, 6));
  };

  const updateContract = async () => {
    // build the contract that can be used in multiple functions
    try {
      const { ethereum } = window;
      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        // const provider = new ethers.providers.Web3Provider(ethereum);
        // const signer = provider.getSigner();
        setLock(new ethers.Contract(lockAddress, lockAbi.abi, signer));
        setUdscToken(new ethers.Contract(usdcAddress, usdcAbi.abi, signer));
        updateBlance();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  useEffect(() => {
    updateContract();
  }, [address]);

  useEffect(() => {
    updateBlance();
  }, [lock, usdcToken]);

  const faucet = async () => {
    try {
      setStatus("Poping up the metamask to confirm the gas fee");

      const amount = ethers.parseUnits(faucetAmount, 6);
      const faucetTxn = await usdcToken.faucet(amount);
      setStatus("Fauceting...please wait.");
      await faucetTxn.wait();
      setStatus(
        `Faucet function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${faucetTxn.hash}`
      );
      console.log(
        `Faucet function called successfully. You can check on https://sepolia.etherscan.io/tx/${faucetTxn.hash}`
      );
      updateBlance();
      setTimeout(() => {
        setStatus("");
      }, 5000);
    } catch (error) {
      setStatus("Error");
      console.log(error);
      setTimeout(() => {
        setStatus("");
      }, 5000);
    }
  };
  const deposit = async () => {
    try {
      setStatus("Poping up the metamask to confirm the gas fee");
      const amount = ethers.parseUnits(depositAmount, 6);
      const approveTxn = await usdcToken.approve(lockAddress, amount);
      setStatus("Approving...please wait.");
      await approveTxn.wait();
      setStatus(
        `Approve function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${approveTxn.hash}`
      );
      console.log(
        `Approve function called successfully. You can check on https://sepolia.etherscan.io/tx/${approveTxn.hash}`
      );

      try {
        setStatus("Poping up the metamask to confirm the gas fee");
        const amount = ethers.parseUnits(depositAmount, 6);
        const depositTxn = await lock.depositUSDC(amount);
        setStatus("Depositing...please wait.");
        await depositTxn.wait();
        setStatus(
          `Deposit function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${depositTxn.hash}`
        );
        console.log(
          `Deposit function called successfully. You can check on https://sepolia.etherscan.io/tx/${depositTxn.hash}`
        );
        updateBlance();
        setTimeout(() => {
          setStatus("");
        }, 5000);
      } catch (error) {
        setStatus("Error");
        console.log(error);
        setTimeout(() => {
          setStatus("");
        }, 5000);
      }
    } catch (error) {
      setStatus("Error");
      console.log(error);
      setTimeout(() => {
        setStatus("");
      }, 5000);
    }
  };
  const withdraw = async () => {
    try {
      setStatus("Poping up the metamask to confirm the gas fee");

      const amount = ethers.parseUnits(withdrawAmount, 6);
      const withdrawTxn = await lock.withdrawUSDC(amount);
      setStatus("Withdrawing...please wait.");
      await withdrawTxn.wait();
      setStatus(
        `Withdraw function called successfully.\nYou can check on https://sepolia.etherscan.io/tx/${withdrawTxn.hash}`
      );
      console.log(
        `Withdraw function called successfully. You can check on https://sepolia.etherscan.io/tx/${withdrawTxn.hash}`
      );
      updateBlance();
      setTimeout(() => {
        setStatus("");
      }, 5000);
    } catch (error) {
      setStatus("Error");
      console.log(error);
      setTimeout(() => {
        setStatus("");
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isConnected ? (
        <>
          <div class="container mx-auto">
            <div>{status}</div>
            <div className="flex items-center space-x-4 my-3">
              <input
                type="text"
                className="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
                placeholder="0"
                value={faucetAmount}
                onChange={(event) => {
                  setFaucetAmount(event.target.value);
                }}
              />
              <button
                type="submit"
                className="w-24 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                onClick={faucet}
              >
                Faucet
              </button>
            </div>
            <div className="flex items-center space-x-4 my-3">
              <input
                type="text"
                className="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
                placeholder="0"
                value={depositAmount}
                onChange={(event) => {
                  setDepositAmount(event.target.value);
                }}
              />
              <button
                type="submit"
                className="w-24 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                onClick={deposit}
              >
                Deposit
              </button>
            </div>
            <div className="flex items-center space-x-4 my-3">
              <input
                type="text"
                className="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
                placeholder="0"
                value={withdrawAmount}
                onChange={(event) => {
                  setWithdrawAmount(event.target.value);
                }}
              />
              <button
                type="submit"
                className="w-24 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                onClick={withdraw}
              >
                Withdraw
              </button>
            </div>
          </div>
          <div class="container mx-auto">
            <div className="flex items-center space-x-4 my-3">
              <span className="w-40">Wallet Amount:</span>
              <input
                type="text"
                className="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
                placeholder="0"
                value={walletUSDCAmount}
                readOnly
              />
            </div>
            <div className="flex items-center space-x-4 my-3">
              <span className="w-40">Deposited Amount:</span>
              <input
                type="text"
                className="w-36 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500 text-black"
                placeholder="0"
                value={depositedUSDCAmount}
                readOnly
              />
            </div>
          </div>
        </>
      ) : (
        <div className="px-60 py-2 text-white">Please connect your wallet</div>
      )}
    </div>
  );
}
