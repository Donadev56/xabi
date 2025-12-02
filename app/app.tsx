"use client";

import React, { Suspense } from "react";
import { createConfig, EVM, ExtendedChain } from "@lifi/sdk";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useChains } from "@/hooks/use_chains";
import { useConnection } from "@/hooks/use_connection";
import { Web3Provider } from "@/hooks/use_web3";
import { LoaderView } from "@/components/loader_view";

export default function App({ children }: { children: React.ReactNode }) {
  const { currentChain } = useConnection();
  const { chains } = useChains();

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
    return <LoaderView />;
  }

  return (
    <Suspense>
      <Web3Provider rpcUrls={rpcUrls} chainId={chainId}>
        {children}
      </Web3Provider>
    </Suspense>
  );
}
