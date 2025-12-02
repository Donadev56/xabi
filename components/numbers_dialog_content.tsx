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
import { IoAdd } from "react-icons/io5";

export const ZeroDialogContent = ({
  onClick,
}: {
  onClick: (zero: { label: string; value: string }) => void;
}) => {
  const zeroes = [
    {
      label: "10e3",
      value: "1000",
    },
    {
      label: "10e6",
      value: "1000000",
    },
    {
      label: "10e9",
      value: "1000000000",
    },
    {
      label: "10e12",
      value: "1000000000000",
    },
    {
      label: "10e15",
      value: "1000000000000000",
    },
    {
      label: "10e18",
      value: "1000000000000000000",
    },
  ];

  return (
    <DialogContent className="sm:max-w-md  w-full overflow-x-hidden">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Add Add Zeroes</h2>
          <p className="text-sm text-muted-foreground">
            Select the number of zeroes to add.
          </p>
        </div>
        <div className="flex max-h-[50svh] overflow-scroll flex-col gap-2 ">
          {zeroes
            .sort((a, b) => Number(a.value ?? "0") - Number(b.value ?? ""))
            .map((e) => {
              return (
                <DialogClose onClick={() => onClick(e)}>
                  <StListTitle
                    className="py-1 bg-card rounded-[5px] group cursor-pointer "
                    leading={
                      <div className="w-6 h-6 rounded-full bg-muted items-center flex justify-center ">
                        <IoAdd />
                      </div>
                    }
                    title={<div className="font-bold">{e.label}</div>}
                    actions={[
                      <div className="group-hover:opacity-100 bg-muted px-2 text-[11px]  rounded-[5px]  text-muted-foreground transition-all">
                        x{e.value}
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
