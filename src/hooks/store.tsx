/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "@/lib/constants";
import React from "react";

//Creating a InterFace for Context API
interface Transaction {
  addressTo: string;
  addressFrom: string;
  timestamp: string;
  message: string;
  keyword: string;
  amount: number;
}

interface TransactionContextValues {
  connectWallet: () => Promise<void>;
  sendTransactions: (
    addressTo: string,
    amount: string,
    message: string,
    keyword: string
  ) => Promise<void>;
  currentAccount: string;
  isLoading: boolean;
  transactions: Transaction[];
}

//Creating a Context API for handling Data Flow Through out the Project
export const TransactionContext = React.createContext<TransactionContextValues>(
  {
    connectWallet: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
    sendTransactions: function (
      addressTo: string,
      amount: string,
      message: string,
      keyword: string
    ): Promise<void> {
      console.log(addressTo, amount, message, keyword);
      throw new Error("Function not implemented.");
    },
    currentAccount: "",
    isLoading: false,
    transactions: [],
  }
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
  const [transactions, setTransactions] = React.useState<any[]>([]);
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

  //Getting Transactions from BlockChain
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        console.log(transactionsContract);
        const availableTransactions =
          await transactionsContract?.getTransactionsCount();
        console.log(availableTransactions);
        const structuredTransactions = availableTransactions.map(
          (transaction: any) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Check if Transactions Exists
  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionsCount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

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
      if (!ethereum) return false;

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
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
    checkIfTransactionsExists();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransactions,
        isLoading,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
