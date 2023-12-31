/* eslint-disable @typescript-eslint/no-explicit-any */
// import { AiFillPayCircle } from "react-icons/ai";
import { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { Loader } from ".";
import { cn } from "@/lib/utils";
import { addressMaster } from "@/lib/addressMasker";
import { TransactionContext } from "@/hooks/store";
import { Formik } from "formik";
const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

function Welcome() {
  const contextValue = useContext(TransactionContext);

  const { currentAccount, connectWallet, sendTransactions, isLoading } =
    contextValue;

  const Input = ({
    placeholder,
    name,
    type,
    value,
    handleChange,
  }: {
    placeholder: string;
    name: string;
    type: string;
    value: string;
    handleChange: any;
  }) => (
    <input
      placeholder={placeholder}
      name={name}
      type={type}
      value={value}
      onChange={handleChange}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
  );

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex flex-col mf:flex-row justify-between items-start md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto
            <br /> across the world
          </h1>
          <p className="ttext-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the Crypto World. Buy and Sell cryptocurrencies on Krypto.
          </p>
          {!currentAccount && (
            <button
              className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
              type="button"
              onClick={connectWallet}
            >
              {" "}
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          )}
          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            <div className={cn("rounded-tl-2xl", companyCommonStyles)}>
              Reliability
            </div>
            <div className={cn("", companyCommonStyles)}>Security</div>
            <div className={cn("md:rounded-tr-2xl", companyCommonStyles)}>
              Ethereum
            </div>
            <div className={cn("md:rounded-bl-2xl", companyCommonStyles)}>
              Web3
            </div>
            <div className={cn("", companyCommonStyles)}>Low Fees</div>
            <div className={cn("rounded-br-2xl", companyCommonStyles)}>
              BlockChain
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light text-sm">
                  {addressMaster(currentAccount)}
                </p>
                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
              </div>
            </div>
          </div>
          <Formik
            initialValues={{
              addressTo: "",
              amount: "",
              keyword: "",
              message: "",
            }}
            onSubmit={(values) => {
              if (sendTransactions) {
                sendTransactions(
                  values.addressTo,
                  values.amount.toString(),
                  values.message,
                  values.keyword
                );
              }
            }}
          >
            {({ handleChange, handleSubmit, values }) => (
              <form
                onSubmit={handleSubmit}
                className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism"
              >
                <Input
                  placeholder="Address To"
                  name="addressTo"
                  type="text"
                  handleChange={handleChange}
                  value={values.addressTo}
                />
                <Input
                  placeholder="Amount (ETH)"
                  name="amount"
                  type="number"
                  handleChange={handleChange}
                  value={values.amount}
                />
                <Input
                  placeholder="Keyword (Gif)"
                  name="keyword"
                  type="text"
                  handleChange={handleChange}
                  value={values.keyword}
                />
                <Input
                  placeholder="Enter Message"
                  name="message"
                  type="text"
                  handleChange={handleChange}
                  value={values.message}
                />
                <div className="h-[1px] w-full bg-gray-400 my-2" />
                {isLoading ? (
                  <Loader />
                ) : (
                  <button
                    type="submit"
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                  >
                    Send now
                  </button>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
