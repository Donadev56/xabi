"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ChainType, ExtendedChain, getChains } from "@lifi/sdk";

interface ChainsContextType {
  chains: ExtendedChain[];
  getChains: () => Promise<ExtendedChain[]>;
  exploreAddress: (address: string, chainId: number) => void;
  chainbyChainId: (chainId: number) => ExtendedChain | undefined;
}

const ChainsContext = createContext<ChainsContextType | undefined>(undefined);

export const ChainsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chains, setChains] = useState<ExtendedChain[]>(() => {
    if (typeof localStorage != "undefined") {
      return JSON.parse(localStorage.getItem("chainList") || "[]");
    }
  });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const result = await fetchChains();
    if (result.length > 0) {
      if (chains.length == 0) {
        setChains(result);
      } else {
        const currentChains = [...chains];
        const currentIds = currentChains.map((e) => e.id);
        for (const eachChain of result) {
          if (!currentIds.includes(eachChain.id)) {
            currentChains.push(eachChain);
          }
        }
        setChains(currentChains);
      }
    }
  };

  const fetchChains = async () => {
    try {
      return await getChains({ chainTypes: [ChainType.EVM] });
    } catch (error) {
      console.error("Failed to fetch chains:", error);
      return [];
    }
  };

  function chainbyChainId(chainId: number) {
    return chains.find((e) => e.id === chainId);
  }

  function exploreAddress(address: string, chainId: number) {
    const chain = chains.find((e) => e.id === chainId);
    if (!chain) {
      return;
    }
    if (typeof window != "undefined") {
      window.open(`${chain.metamask.blockExplorerUrls[0]}/address/${address}`);
    }
  }
  const contextValue: ChainsContextType = {
    chains,
    getChains: fetchChains,
    exploreAddress,
    chainbyChainId,
  };

  return (
    <ChainsContext.Provider value={contextValue}>
      {children}
    </ChainsContext.Provider>
  );
};

export const useChains = (): ChainsContextType => {
  const context = useContext(ChainsContext);
  if (!context) {
    throw new Error("useChains must be used within a ChainsProvider");
  }
  return context;
};
