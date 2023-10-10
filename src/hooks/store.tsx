import { ethers } from "ethers";
import { contractAbi, contractAddress } from "@/lib/constants";
import React from "react";

export const TransactionContext = React.createContext({});
declare global {
  interface Window {
    ethereum?: unknown;
  }
}
const { ethereum } = window;

if (!ethereum) {
  console.error("Ethereum provider not found");
}
function getEtherumContract() {
  const provider = new ethers.providers.Web3Provider(ethereum);

  const signer = provider.getSigner();

  const transactionContract = new ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );

  console.log({
    provider,
    signer,
    transactionContract,
  });
}

export const TransactionsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [formData, setformData] = React.useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [transactionCount, setTransactionCount] = React.useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = React.useState([]);
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  async function CheckIfWalletIsConnected() {
    if (!ethereum) return alert("Please Install MetaMask");

    const accounts = await ethereum.request({
      method: "eth_accounts",
    });

    console.log(accounts);
  }
  React.useEffect(() => {
    CheckIfWalletIsConnected();
  });
  return (
    <TransactionContext.Provider value={{ connectWallet }}>
      {children}
    </TransactionContext.Provider>
  );
};
