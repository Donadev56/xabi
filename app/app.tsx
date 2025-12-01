"use client";

import React, { Suspense } from "react";
import { createConfig, EVM, ExtendedChain } from "@lifi/sdk";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useChains } from "@/hooks/use_chains";
import { useConnection } from "@/hooks/use_connection";
import { Web3Provider } from "@/hooks/use_web3";

export default function App({ children }: { children: React.ReactNode }) {
  const { currentChain } = useConnection();
  const {chains} = useChains();

  const chainId = React.useMemo(() => currentChain.id || 1, [currentChain.id]);
  const rpcUrls = React.useMemo(
    () =>
      (chains ?? []).find((e) => e.id === currentChain.id)?.metamask.rpcUrls ||
      [],
    [chainId, chains],
  );

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[100svh] w-full flex items-center justify-center ">
        <div className="relative">
          {/* Pulsing background circle */}

          {/* Rotating logo */}
          <div className="relative  ">
            <img
              src="/images/android-chrome-512x512.png"
              className="w-20 h-20"
              alt="Loading"
            />
          </div>

          {/* Outer rotating ring */}
          <div className="absolute -inset-4 border-3 border-primary border-t-transparent rounded-full animate-spin duration-2000"></div>
        </div>
      </div>
    );
  }

  return (
    <Suspense>
      <Web3Provider rpcUrls={rpcUrls} chainId={chainId}>
        {children}
      </Web3Provider>
    </Suspense>
  );
}
