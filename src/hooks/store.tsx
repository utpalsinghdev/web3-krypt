/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "@/lib/constants";
import React from "react";
import { Web3Provider } from "@ethersproject/providers";

interface TransactionContextValues {
  connectWallet?: () => void;
  sendTransactions?: () => void;
  currentAccount?: string;
}

export const TransactionContext = React.createContext<TransactionContextValues>(
  {}
);
declare global {
  interface Window {
    ethereum?: any;
  }
}

const { ethereum } = window;

if (!ethereum) {
  console.error("Ethereum provider not found");
}
function getEtherumContract() {
  const provider = new Web3Provider(ethereum);

  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(contractAddress, contractAbi);

  return transactionContract;
}

export const TransactionsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [currentAccount, setCurrentAccount] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [transactionCount, setTransactionCount] = React.useState<string>(
    localStorage.getItem("transactionCount") || ""
  );
  const [transactions, setTransactions] = React.useState<any[]>([]);

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      throw new Error("No ethereum object");
    }
  };
  async function sendTransactions() {
    try {
      if (!ethereum) return alert("Please Install MetaMask");
      const transactionContract = getEtherumContract();
    } catch (error) {
      console.log(error);
    }
  }
  async function CheckIfWalletIsConnected() {
    try {
      if (!ethereum) return alert("Please Install MetaMask");

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No Accounts Found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    CheckIfWalletIsConnected();
  }, []);
  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
