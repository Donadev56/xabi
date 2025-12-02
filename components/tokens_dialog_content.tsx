"use client";

import Image from "next/image";
import React from "react";
import { Contract, Web3 } from "web3";
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
import { TokenAmount } from "@lifi/sdk";

export const TokensDialogContent = ({
  tokens,
  onClick,
}: {
  onClick: (token: TokenAmount) => void;
  tokens: TokenAmount[];
}) => {
  const [query, setQuery] = React.useState<string>("");

  const filteredTokens = React.useMemo(() => {
    if (!query.trim()) return tokens;
    const q = query.toLowerCase();
    return tokens.filter((chain) =>
      Object.values(chain).some((value) =>
        typeof value === "object"
          ? Object.values(value).some((v: any) =>
              v.toString().toLowerCase().includes(q),
            )
          : value.toString().toLowerCase().includes(q),
      ),
    );
  }, [tokens, query]);

  return (
    <DialogContent className="sm:max-w-md">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Select Token</h2>
          <p className="text-sm text-muted-foreground">
            Choose a Token to interact with
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search Tokens..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex max-h-[50svh] overflow-scroll flex-col gap-2 ">
          {filteredTokens
            .sort((a, b) => Number(b.amount ?? 0) - Number(a.amount ?? 0))
            .map((token) => {
              return (
                <DialogClose onClick={() => onClick(token)}>
                  <StListTitle
                    className="py-1 group cursor-pointer "
                    leading={
                      <CryptoAvatar
                        className="bg-muted"
                        logoUri={token.logoURI}
                        size={30}
                      />
                    }
                    title={<div>{token.name}</div>}
                    actions={[
                      <div className="group-hover:opacity-100 text-muted-foreground transition-all">
                        {(
                          Number(token.amount ?? "0") /
                          10 ** token.decimals
                        ).toLocaleString()}
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
