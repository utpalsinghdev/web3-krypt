/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "@/lib/constants";
import React from "react";

//Creating a InterFace for Context API
interface TransactionContextValues {
  connectWallet?: () => void;
  sendTransactions?: (
    addressTo: string,
    amount: string,
    message: string,
    keyword: string
  ) => Promise<void>;
  currentAccount?: string;
  isLoading?: boolean;
}

//Creating a Context API for handling Data Flow Through out the Project
export const TransactionContext = React.createContext<TransactionContextValues>(
  {}
);

//Declare Window as Global
declare global {
  interface Window {
    ethereum?: any;
  }
}

const { ethereum } = window;

//Ethereum ContractService
function createEthereumContract() {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );

  return transactionsContract;
}

//Transaction Provider Context
export const TransactionsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  //States and Variables
  const [currentAccount, setCurrentAccount] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [transactionCount, setTransactionCount] = React.useState<string>(
    localStorage.getItem("transactionCount") || ""
  );
  // const [transactions, setTransactions] = React.useState<any[]>([]);
  console.log(transactionCount);

  //Functions and Handlers

  //Connect to Wallet Function
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

  //Send Eth Function
  async function sendTransactions(
    addressTo: string,
    amount: string,
    message: string,
    keyword: string
  ) {
    const parsedAmount = ethers.utils.parseEther(amount);

    console.log(addressTo, parsedAmount, message, keyword);
    try {
      if (!ethereum) return alert("Please Install MetaMask");
      const transactionContract = createEthereumContract();
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //21,000 GWEI
            value: parsedAmount._hex,
          },
        ],
      });
      const transactionHash = await transactionContract.addToBlockChain(
        addressTo,
        parsedAmount._hex,
        message,
        keyword
      );

      setIsLoading(true);
      console.log(`loading - ${transactionHash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Sucess - ${transactionHash}`);

      const transactionCount = await transactionContract.getTransactionsCount();
      console.log(transactionCount);
      setTransactionCount(transactionCount.toNumber());
    } catch (error) {
      console.log(error);
    }
  }

  //Checking if Wallet Already Connected or Not
  async function CheckIfWalletIsConnected() {
    try {
      if (!ethereum) return false

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

  //Calling Handlers
  React.useEffect(() => {
    CheckIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
