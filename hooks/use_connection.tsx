"use client";

import { Ethereum } from "@/lib/utils";
import { ExtendedChain } from "@lifi/sdk";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useChains } from "./use_chains";
import useWeb3 from "./use_web3";

interface ConnectionContextType {
  currentChain: ExtendedChain;
  setCurrentChain: (id: number) => void;
  recentlyUsed: number[];
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined,
);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentChain, setCurrentChain] = React.useState<ExtendedChain>(
    Ethereum as any,
  );
  const chains = useChains();
  const chainList = useMemo(() => chains.chains, [chains]);
  const [recentlyUsed, setRecentlyUsed] = React.useState<number[]>([]);
  const usedKey = "recently-used-chains";

  //React.useEffect(() => {
  //  getSavedChainId();
  // }, [chains.chains]);

  const changeChain = (id: number) => {
    /*
    if (typeof localStorage !== "undefined") {
      const savedChains = getSavedUsedChain();
      localStorage.setItem(key, String(id));
      localStorage.setItem(
        usedKey,
        JSON.stringify(
          savedChains.length > 5
            ? [...savedChains.slice(1, 5), id]
            : [...savedChains, id],
        ),
      );
    }*/
    const targetChain = chainList.find((c) => c.id === id);
    if (!targetChain) {
      console.error("Chain Id not found");
      return;
    }
    setCurrentChain(targetChain);
  };
  /*
  function getSavedChainId() {
    let id: number = 1;

    if (typeof localStorage !== "undefined") {
      const savedChainId = localStorage.getItem(key);
      if (savedChainId) {
        id = Number(savedChainId);
      }
    }
    const targetChain = chainList.find((c) => c.id === id);
    if (!targetChain) {
      return;
    }
    setCurrentChain(targetChain);
  } */
  function getSavedUsedChain() {
    let chains: number[] = [];
    if (typeof localStorage !== "undefined") {
      const savedChains = localStorage.getItem(usedKey);
      if (savedChains) {
        chains = JSON.parse(savedChains);
      }
    }
    return chains;
  }

  React.useEffect(() => {
    setRecentlyUsed(new Set(getSavedUsedChain()).values().toArray());
  }, [currentChain]);
  const contextValue: ConnectionContextType = {
    currentChain,
    setCurrentChain: changeChain,
    recentlyUsed,
  };

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
