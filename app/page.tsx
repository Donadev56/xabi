"use client";

import Image from "next/image";
import React from "react";
import { Contract, Web3 } from "web3";
import { ExtendedChain, getChains } from "@lifi/sdk";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ABIFunction, ContractSourceCode } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoIosCopy, IoIosPaper } from "react-icons/io";
import { CiViewTimeline } from "react-icons/ci";
import { get } from "http";
import { IoCopy, IoReload, IoWallet } from "react-icons/io5";
import { Spinner } from "@/components/ui/spinner";
import { ApiRequestManager } from "@/lib/api_request_manager";
import { useChains } from "@/hooks/use_chains";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  MoreVertical,
  MoreVerticalIcon,
  WalletIcon,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StListTitle } from "@/components/ui/st_list_title";
import { CryptoAvatar } from "@/components/ui/crypto_avatar";
import { useConnection } from "@/hooks/use_connection";
import { Blur, Scale } from "@/components/ui/transitions";
import { motion } from "framer-motion";
import useWeb3 from "@/hooks/use_web3";
import TransactionSigner from "@/lib/signer";
import { ExploreAddress, ExploreTx, Web3Utils } from "@/lib/utils";
import { copy } from "@/lib/app-utils";
import Link from "next/link";
import { ZeroAddress } from "ethers";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ui/theme_toogle";

export default function Home() {
  const contractKey = "contract-address";
  const [address, setAddress] = React.useState(
    () => localStorage.getItem("contract-address") ?? "",
  );
  const [error, setError] = React.useState<string | null>(null);
  const [functions, setFunctions] = React.useState<ABIFunction[]>([]);
  const connection = useConnection();
  const [source, setSource] = React.useState<ContractSourceCode | null>(null);
  const currentChain = connection.currentChain;

  const provider = useWeb3();

  const web3 = React.useMemo(() => {
    const rpc = provider.availableRpc;
    return new Web3(rpc);
  }, [provider.availableRpc]);

  const contract = React.useMemo(() => {
    if (!validateAddress(address)) {
      return new web3.eth.Contract(functions as any, ZeroAddress);
    }
    return new web3.eth.Contract(functions as any, address);
  }, [address, functions, web3]);

  React.useEffect(() => {
    localStorage.setItem(contractKey, address);
  }, [address]);
  React.useEffect(() => {
    getContractDataWithToast();
  }, [address, currentChain]);
  const functionsStates = React.useMemo(() => {
    return [
      {
        name: "Read",
        value: "read-no-inputs",
        functions: functions.filter(
          (e) =>
            (e.inputs.length === 0 && e.stateMutability === "view") ||
            e.stateMutability === "pure",
        ),
        icon: IoIosPaper,
        className: "",
      },
      {
        name: "Read & inputs",
        value: "read-with-inputs",
        functions: functions.filter(
          (e) =>
            (e.inputs.length > 0 && e.stateMutability === "view") ||
            e.stateMutability === "pure",
        ),
        icon: CiViewTimeline,
        className: "",
      },
      {
        name: "Write",
        value: "write",
        functions: functions.filter(
          (e) =>
            e.stateMutability === "nonpayable" ||
            e.stateMutability === "payable",
        ),
        icon: CiViewTimeline,
        className: "",
      },
    ];
  }, [functions]);

  function validateAddress(address: string) {
    return Web3Utils.isAddressValid(address);
  }
  const getContractData = async () => {
    try {
      setError(null);
      if (!validateAddress(address)) {
        throw new Error("Invalid contract address");
      }
      const manager = new ApiRequestManager();
      const source = await manager.getContractSourceCode(
        currentChain?.id ?? 1,
        address,
      );
      setSource(source);
      console.log({ source });
      if (!source) {
        throw new Error("Source not found");
      }
      const abi = JSON.parse(source.ABI);
      console.log({ abi });
      const funtions = abi.filter((e: any) => e.type === "function");
      console.log({ funtions });
      setFunctions(funtions);
    } catch (error) {
      const err = (error as any)?.message || String(error);
      setError(err);
      toast.error("Failed to fetch contract data", { description: err });
    }
  };

  function getContractDataWithToast() {
    toast.promise(getContractData, {
      loading: "Fetching contract data...",
      success: "Contract data fetched!",
      error: "Error fetching contract data.",
    });
  }

  return (
    <div className="w-full h-svh items-center flex flex-col justifyc-enter  space-y-6  ">
      <div className="w-full z-1000 fixed p-6 top-0 left-0 right-0 flex justify-center">
        <StListTitle
          className="max-w-[750px] bg-card  rounded-full py-2 w-full "
          leading={
            <div>
              <IoWallet className="w-6 h-6 " />
            </div>
          }
          title={
            <div
              onClick={() => {
                copy(provider.account);
              }}
            >
              {Web3Utils.truncatedAddress(provider.account)}
            </div>
          }
          actions={[
            <ThemeToggle />,
          ]}
        />
      </div>
      <div className="w-full mt-20 min-h-svh items-center flex flex-col justifyc-enter  space-y-6  p-6 ">
        <h1 className="text-[30px] max-w-[300px] text-center  font-bold ">
          {" "}
          <span className="text-muted-foreground text-sm ">
            Welcome to
          </span>{" "}
          <span className="uppercase"> XABI</span>{" "}
        </h1>
        <p className="text-[12px] text-muted-foreground text-center max-w-md ">
          by{" "}
          <Link className="underline" href="https://opennode.dev">
            opennode.dev
          </Link>{" "}
          - Explore and interact with Ethereum smart contracts
        </p>

        <div className="text-md text-muted-foreground text-center ">
          Enter contarct address and chain to see and interact with.
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex px-2 focus:boerder-primary py-1.5 bg-card rounded-full cursor-pointer items-center gap-2">
              <img
                className="w-7 h-7 rounded-full "
                src={currentChain?.logoURI}
              />{" "}
              {currentChain?.name || "Select a valid chain"}{" "}
              <ChevronDownIcon className="text-muted-foreground" />
            </div>
          </DialogTrigger>

          <ChainDialogContent
            onSelect={(c) => connection.setCurrentChain(c.id)}
          />
        </Dialog>

        <div className="flex flex-col w-full max-w-[750px] gap-3 ">
          <Label className="text-muted-foreground" htmlFor="address">
            Address
          </Label>
          <Input
            name="address"
            id="address"
            className="w-full"
            type="text"
            placeholder="0x0..."
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
          <Label className="text-muted-foreground" htmlFor="abi">
            ABI
          </Label>

          <Textarea
            onChange={(e) => setFunctions(JSON.parse(e.target.value))}
            value={JSON.stringify(functions)}
            className="max-h-15"
            name="abi"
            id="abi"
          />
          <p className="text-muted-foreground text-[12px]">
            Enter ABI json if not verified on chain.
          </p>
        </div>

        <div className="w-full max-w-[750px] flex  ">
          <Button className="" onClick={() => getContractDataWithToast()}>
            Submit
          </Button>
        </div>

        {error && (
          <Alert variant={"destructive"}>
            <AlertTitle>An error occurred</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Blur className="w-full max-w-[750px] " displayWhen={!!source}>
          <h1 className="font-bold text-3xl text-start w-full my-2">
            {source?.ContractName}
          </h1>
          <div>
            <div className="text-muted-foreground my-2">
              Compiler {source?.CompilerVersion}
            </div>
            <Button
              variant={"outline"}
              className="p-0 my-2"
              onClick={() => {
                ExploreAddress(currentChain.id, address);
              }}
            >
              View Source Code <ExternalLinkIcon className="inline ml-2 mb-1" />
            </Button>
          </div>
        </Blur>

        {functions.length > 0 && (
          <Tabs
            defaultValue={functionsStates[0].value}
            className="w-full max-w-[750px] flex items-center flex-col "
          >
            <TabsList className="w-full">
              {functionsStates.map((state) => {
                return (
                  <TabsTrigger className="w-full" value={state.value}>
                    {state.name} ({state.functions.length})
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {functionsStates.map((state) => {
              return (
                <TabsContent className="w-full" value={state.value}>
                  <div className="w-ful my-4 flex flex-wrap gap-4 justify-center ">
                    {state.functions.length > 0 ? (
                      state.functions.map((f, index) => {
                        return (
                          <FunctionStateCard
                            key={index}
                            f={f}
                            contract={contract}
                            account={provider.account}
                            web3={web3}
                            currentChain={currentChain}
                          />
                        );
                      })
                    ) : (
                      <div className="text-muted-foreground ">
                        No functions available
                      </div>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </div>
  );
}

const FunctionStateCard = ({
  f,
  contract,
  account,
  web3,
  currentChain,
}: {
  f: ABIFunction;
  contract: Contract<any>;
  account: string;
  web3: Web3;
  currentChain: ExtendedChain;
}) => {
  const isReadOnly =
    f.stateMutability === "view" || f.stateMutability === "pure";

  const containsInput = f.inputs.length > 0;
  const isPayable = f.stateMutability === "payable";

  const [result, setResult] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [inputsValues, setInputsValues] = React.useState<any>({});
  const [payableValue, setPayableValue] = React.useState<string>("0");
  const [hash, setHash] = React.useState<string | null>();

  async function getReadOnlyResult() {
    try {
      setIsLoading(true);
      const res = await contract.methods[f.name]().call();
      parseResponse(res);
    } catch (error) {
      console.log(error);
      const err = (error as any)?.message || String(error);
      toast.error("Failed to call read-only function", { description: err });
    } finally {
      setIsLoading(false);
    }
  }

  function parseResponse(res: any) {
    switch (typeof res) {
      case "object":
        const str = JSON.stringify(
          res,
          (_, value) => (typeof value === "bigint" ? value.toString() : value),
          2,
        );
        console.log(typeof str);

        setResult(str);
        break;
      case "boolean":
        setResult(String(res));
        break;

      default:
        setResult(res ?? "Empty");
        break;
    }
  }

  async function getReadOnlyResultWithInput() {
    try {
      setIsLoading(true);
      const res = await contract.methods[f.name](
        ...Object.values(inputsValues),
      ).call();
      console.log({ res });
      console.log(typeof res);

      parseResponse(res);
    } catch (error) {
      console.log(error);
      const err = (error as any)?.message || String(error);
      toast.error("Failed to call read-only function", { description: err });
    } finally {
      setIsLoading(false);
    }
  }

  async function write() {
    try {
      setHash(null);
      setIsLoading(true);
      const data = contract.methods[f.name](
        ...Object.values(inputsValues),
      ).encodeABI();
      const signer = new TransactionSigner(web3);

      const res = await signer.signAndSendTransaction({
        to: contract.options.address ?? "",
        data,
        value: Number(isPayable ? payableValue : "0"),
        from: account,
      });
      setHash(res);
      parseResponse(res);
    } catch (error) {
      console.log(error);
      const err = (error as any)?.message || String(error);
      toast.error("Failed write contract", { description: err });
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (isReadOnly && !containsInput) {
      getReadOnlyResult();
    }
  }, []);

  return (
    <div className="w-full border max-w-[350px]  p-4 rounded-lg flex flex-col gap-4 ">
      <div className="w-full items-center justify-between flex ">
        <div className="font-bold text-lg ">{f.name} </div>
        <Scale displayWhen={isReadOnly && !containsInput}>
          <div
            onClick={() => {
              if (isReadOnly && !containsInput) {
                getReadOnlyResult();
              }
            }}
            className=" "
          >
            {isLoading ? <Spinner /> : <IoReload />}{" "}
          </div>
        </Scale>
      </div>
      <div className="w-full">
        <Scale displayWhen={containsInput}>
          <div>
            <div className="flex gap-2 flex-col my-3">
              <Blur displayWhen={isPayable}>
                <Input
                  name="payable"
                  id={"payable"}
                  onChange={(e) => {
                    setPayableValue(e.target.value);
                  }}
                  type="text"
                  placeholder={`Payable value (WEI)`}
                />
              </Blur>
              {f.inputs.map((input, index) => {
                return (
                  <motion.div key={index}>
                    <Input
                      name={input.name}
                      id={input.name}
                      onChange={(e) => {
                        const { value, name } = e.target;
                        setInputsValues({
                          ...inputsValues,
                          [name]: value,
                        });
                      }}
                      type="text"
                      placeholder={`${input.name}${input.name && ":"} ${input.type}`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Scale>
        <Scale displayWhen>
          <div className="w-full ">
            <div className="font-sm  flex justify-between items-center text-muted-foreground bg-card px-2 pb-1 rounded-[10px] w-full mb-1.5  ">
              <div>Result:</div>{" "}
              <Scale onClick={() => copy(result)} displayWhen={!!result}>
                <IoCopy />
              </Scale>
            </div>
            <div className="w-full px-2">
              <pre className=" max-h-25 w-full overflow-scroll ">{result}</pre>
            </div>
            <div className="px-2">
              {f.outputs?.map((output, index) => {
                return (
                  <div className="text-muted-foreground text-sm" key={index}>
                    {output.type}
                  </div>
                );
              })}
            </div>
          </div>
        </Scale>
        <Blur displayWhen={isReadOnly && containsInput}>
          <Button
            disabled={isLoading}
            onClick={getReadOnlyResultWithInput}
            className=" my-4"
          >
            {isLoading ? <Spinner /> : "Query"}
          </Button>
        </Blur>

        <Blur displayWhen={!isReadOnly}>
          <Button disabled={isLoading} onClick={write} className=" my-4">
            {isLoading ? <Spinner /> : "Write"}
          </Button>
        </Blur>

        <Blur displayWhen={!!hash}>
          <Button
            variant={"outline"}
            disabled={isLoading}
            onClick={() => {
              ExploreTx(currentChain.id, hash ?? "");
            }}
            className=" w-full my-4"
          >
            View on Explorer <ExternalLinkIcon className="inline ml-2 mb-1" />
          </Button>
        </Blur>
      </div>
    </div>
  );
};

const ChainDialogContent = ({
  onSelect,
}: {
  onSelect: (chain: ExtendedChain) => void;
}) => {
  const chains = useChains().chains;
  const [query, setQuery] = React.useState<string>("");
  const filteredChains = React.useMemo(() => {
    if (query.trim() === "") {
      return chains;
    }
    return chains.filter((chain) =>
      Object.values(chain).some((v: any) =>
        v.toString().toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }, [chains, query]);
  return (
    <DialogContent showCloseButton={false}>
      <div>
        <Input
          placeholder="Search"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </div>
      <div className="flex max-h-120 overflow-scroll flex-col gap-2 ">
        {filteredChains.map((chain) => {
          return (
            <DialogClose onClick={() => onSelect(chain)}>
              <StListTitle
                className="py-1 group cursor-pointer "
                leading={
                  <CryptoAvatar
                    className="bg-muted"
                    logoUri={chain.logoURI}
                    size={30}
                  />
                }
                title={<div>{chain.name}</div>}
                actions={[
                  <div className="group-hover:opacity-100 text-muted-foreground opacity-0 transition-all">
                    {chain.id}
                  </div>,
                ]}
              />
            </DialogClose>
          );
        })}
      </div>
    </DialogContent>
  );
};
