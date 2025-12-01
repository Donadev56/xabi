"use client";

import Image from "next/image";
import React from "react";
import { Contract, Web3 } from "web3";
import { ExtendedChain } from "@lifi/sdk";
import { Input } from "@/components/ui/input";

import {
  BookOpen,
  ExternalLink,
  Wallet,
  Search,
  Code,
  FileText,
  Send,
  Eye,
  EyeOff,
} from "lucide-react";

import { useChains } from "@/hooks/use_chains";
import { ChevronDown, MoreVertical, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { StListTitle } from "@/components/ui/st_list_title";
import { CryptoAvatar } from "@/components/ui/crypto_avatar";
import { FaFileAlt } from "react-icons/fa";

export const ChainDialogContent = ({
  onSelect,
}: {
  onSelect: (chain: ExtendedChain) => void;
}) => {
  const chains = useChains().chains;
  const [query, setQuery] = React.useState<string>("");

  const filteredChains = React.useMemo(() => {
    if (!query.trim()) return chains;
    const q = query.toLowerCase();
    return chains.filter((chain) =>
      Object.values(chain).some((value) =>
        typeof value === "object"
          ? Object.values(value).some((v: any) =>
              v.toString().toLowerCase().includes(q),
            )
          : value.toString().toLowerCase().includes(q),
      ),
    );
  }, [chains, query]);

  return (
    <DialogContent className="sm:max-w-md">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Select Network</h2>
          <p className="text-sm text-muted-foreground">
            Choose a network to interact with
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search networks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex max-h-[50svh] overflow-scroll flex-col gap-2 ">
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
      </div>
    </DialogContent>
  );
};
