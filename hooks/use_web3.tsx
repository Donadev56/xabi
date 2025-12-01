"use client";

import { Web3 } from "web3";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Web3Utils } from "@/lib/utils";
import { toast } from "sonner";
import { useConnection } from "./use_connection";

export interface web3ContextType {
  web3: Web3;
  account: string;
  accounts: string[];
  disconnect: () => void;
  isConnected: boolean;
  connect: () => Promise<void>;
  changeNetwork: () => void;
  chainId: number;
  getChainId: () => any;
  getEthBalance: () => Promise<bigint>;
  ethereum: any;
  rpcUrls: string[];
  availableRpc: string;
  setAvailableRpc: (rpc: string) => void;
}

const Web3Context = createContext<web3ContextType | undefined>(undefined);
export const Web3Provider = ({
  children,
  rpcUrls,
  chainId,
}: {
  children: React.ReactNode;
  rpcUrls: string[];
  chainId: number;
}) => {
  const [account, setAccount] = useState("");
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [availableRpc, setAvailableRpc] = React.useState<string>(rpcUrls[0]);
  const connection = useConnection();
  console.log("Available provider :", availableRpc);

  const web3 = useMemo(() => new Web3(availableRpc), [availableRpc]);

  const ethereum = useMemo(() => {
    if (typeof window !== "undefined") {
      return (window as any).ethereum;
    }
    return undefined;
  }, [chainId]);

  useEffect(() => {
    if (ethereum && !isConnected) {
      connect();
    }
  }, [ethereum]);

  React.useEffect(() => {
    getAvailableRpc();
  }, [rpcUrls]);

  const getChainId = useCallback(() => {
    if (ethereum != undefined)
      return ethereum.request({
        method: "eth_chainId",
        params: [],
      });
  }, [ethereum, isConnected]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAccount("");
    setAccounts([]);
  }, [ethereum]);

  const changeNetwork = useCallback(async () => {
    if (ethereum != undefined) {
      const response = await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      console.log({ changeNetworkResponse: response });
      connection.setCurrentChain(chainId);
    }
  }, [chainId]);

  const updateAccounts = (accounts: string[]) => {
    toast.success(Web3Utils.truncatedAddress(accounts[0]) + " Connected");
    setAccount(accounts[0]);
    setAccounts(accounts);
  };

  const connect = useCallback(async () => {
    try {
      if (ethereum == undefined) {
        throw new Error("Metamask no found");
      }
      const accounts: string[] = await ethereum.request({
        method: "eth_requestAccounts",
        params: [],
      });
      if (accounts.length > 0) {
        updateAccounts(accounts);
        setIsConnected(true);
      } else {
        throw new Error("Ethereum is connected but no account was found");
      }
    } catch (error) {
      setIsConnected(false);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Error : ${error}`);
    }
  }, [account, isConnected]);

  useEffect(() => {
    const checkNetwork = async () => {
      const chainIdResponse = await getChainId();
      if (Number(chainIdResponse) !== chainId) {
        changeNetwork();
      }
    };
    checkNetwork();
  }, [chainId]);

  const getEthBalance = useCallback(async () => {
    try {
      const balance = await web3.eth.getBalance(account);
      if (balance) {
        return balance;
      }
      return BigInt(0);
    } catch (error) {
      console.error(error);
      return BigInt(0);
    }
  }, [ethereum, account, isConnected]);

  useEffect(() => {
    connect();
    if (ethereum) {
      ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          updateAccounts(accounts);
        } else {
          console.log("No account connected");
        }
      });
    }
  }, []);

  async function getAvailableRpc() {
    try {
      if (rpcUrls.length == 0) return;
      setAvailableRpc(rpcUrls[0]);

      if (rpcUrls?.length == 1) {
        setAvailableRpc(rpcUrls[0]);
      }
      for (const rpc of rpcUrls) {
        const isAvailable = await Web3Utils.isRpcUrlAvailable(rpc);
        if (isAvailable) {
          setAvailableRpc(rpc);
          break;
        }
      }
      if (availableRpc.length === 0) {
        setAvailableRpc(rpcUrls[0] || "");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Web3Context.Provider
      value={{
        setAvailableRpc,
        availableRpc,
        rpcUrls,
        getEthBalance,
        ethereum,
        getChainId,
        web3,
        connect,
        disconnect,
        isConnected,
        chainId,
        changeNetwork,
        account,
        accounts,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

const useWeb3 = (): web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error(
      "Context Provider is missing ! please add <Web3Provider> tag",
    );
  }

  return context;
};
export default useWeb3;
