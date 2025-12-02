"use client";

import React from "react";
import { Contract, Web3 } from "web3";
import { ExtendedChain } from "@lifi/sdk";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ABIFunction, ContractSourceCode } from "@/types/types";
import { IoReload, IoCopy, IoWallet, IoAdd } from "react-icons/io5";
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
import { Spinner } from "@/components/ui/spinner";

import { useConnection } from "@/hooks/use_connection";
import { Blur, Scale } from "@/components/ui/transitions";
import { motion } from "framer-motion";
import useWeb3 from "@/hooks/use_web3";
import TransactionSigner from "@/lib/signer";
import {
  ExploreAddress,
  ExploreTx,
  SplitCamelCase,
  Web3Utils,
} from "@/lib/utils";
import { copy } from "@/lib/app-utils";
import Link from "next/link";
import { ZeroAddress } from "ethers";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/theme_toogle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ZeroDialogContent } from "./numbers_dialog_content";

export const FunctionStateCard = ({
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
  const containsSingleInput = f.inputs.length === 1;
  const addressInputCount = f.inputs.filter((e) => e.type === "address").length;
  const canStartWithUserAddress =
    containsSingleInput && addressInputCount === 1 && isReadOnly;

  const isPayable = f.stateMutability === "payable";

  const [result, setResult] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [inputValues, setInputValues] = React.useState<Record<string, any>>(
    canStartWithUserAddress
      ? {
          [f.inputs[0].name || `param_${0}`]: account,
        }
      : {},
  );
  const [payableValue, setPayableValue] = React.useState<string>("0");
  const [hash, setHash] = React.useState<string | null>(null);

  const stateMutabilityColors = {
    view: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    pure: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    payable:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    nonpayable: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  };

  async function getReadOnlyResult() {
    try {
      setIsLoading(true);
      const res = await contract.methods[f.name]().call();
      parseResponse(res);
    } catch (error) {
      const err = (error as any)?.message || String(error);
      toast.error("Failed to call function", { description: err });
    } finally {
      setIsLoading(false);
    }
  }

  async function getReadOnlyResultWithInput() {
    try {
      setIsLoading(true);
      const res = await contract.methods[f.name](
        ...Object.values(inputValues),
      ).call();
      parseResponse(res);
    } catch (error) {
      const err = (error as any)?.message || String(error);
      toast.error("Failed to call function", { description: err });
    } finally {
      setIsLoading(false);
    }
  }

  async function write() {
    try {
      setHash(null);
      setIsLoading(true);
      const data = contract.methods[f.name](
        ...Object.values(inputValues),
      ).encodeABI();
      const signer = new TransactionSigner(web3);

      const res = await signer.signAndSendTransaction({
        to: contract.options.address ?? "",
        data,
        value: Number(isPayable ? payableValue : "0"),
        from: account,
      });
      setHash(res);
      toast.success("Transaction sent!", {
        description: "Your transaction has been submitted to the network.",
      });
    } catch (error) {
      const err = (error as any)?.message || String(error);
      toast.error("Transaction failed", { description: err });
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
        setResult(str);
        break;
      case "boolean":
        setResult(String(res));
        break;
      default:
        setResult(res?.toString() || "Empty");
        break;
    }
  }

  React.useEffect(() => {
    if (isReadOnly && !containsInput) {
      getReadOnlyResult();
    }
    if (canStartWithUserAddress) {
      getReadOnlyResultWithInput();
    }
  }, []);

  return (
    <Card className="overflow-hidden  hover:shadow-lg transition-shadow">
      <CardHeader className="">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg truncate max-w-full font-mono">
              {SplitCamelCase(f.name)}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={stateMutabilityColors[f.stateMutability]}
              >
                {f.stateMutability}
              </Badge>
            </div>
          </div>
          {isReadOnly && !containsInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={getReadOnlyResult}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <IoReload className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 ">
        {/* Inputs Section */}
        <Scale displayWhen={containsInput || !isReadOnly}>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Inputs</Label>
            {isPayable && (
              <div className="space-y-2">
                <Label htmlFor="payable" className="text-xs">
                  Value (WEI)
                </Label>
                <Input
                  id="payable"
                  value={payableValue}
                  onChange={(e) => setPayableValue(e.target.value)}
                  placeholder="0"
                  className="font-mono text-sm"
                />
              </div>
            )}
            {f.inputs.map((input, index) => {
              const isNumber = input.type.startsWith("uint");
              return (
                <div key={index} className="relative">
                  <Input
                    id={input.name}
                    value={inputValues[input.name || `param_${index}`]}
                    onChange={(e) => {
                      setInputValues({
                        ...inputValues,
                        [input.name || `param_${index}`]: e.target.value,
                      });
                    }}
                    placeholder={`Enter ${input.type}`}
                    className="font-mono text-sm"
                  />
                  <Dialog>
                    <DialogTrigger>
                      <Blur
                        displayWhen={isNumber}
                        className="absolute  right-0 bottom-[5%] "
                      >
                        <Button className="p-0 w-8 h-8">
                          <IoAdd />
                        </Button>
                      </Blur>
                    </DialogTrigger>
                    <DialogContent>
                      <ZeroDialogContent
                        onClick={(zeros) => {
                          const value =
                            inputValues[input.name || `param_${index}`];
                          let newValue = "";
                          if (!value || value.trim().length === 0) {
                            newValue = zeros.value;
                          } else {
                            newValue = value + zeros.value.slice(1);
                          }

                          setInputValues({
                            ...inputValues,
                            [input.name || `param_${index}`]: newValue,
                          });
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              );
            })}
          </div>
        </Scale>

        {/* Result Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Result</Label>
            <Scale displayWhen={!!result}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copy(result)}
                className="h-7 gap-1"
              >
                <IoCopy className="h-3 w-3" />
              </Button>
            </Scale>
          </div>
          {result ? (
            <pre className="max-h-48 overflow-auto rounded-md bg-muted p-3 text-sm">
              {result}
            </pre>
          ) : (
            <div className="rounded-md border border-dashed p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No result yet. Execute the function to see output.
              </p>
            </div>
          )}
        </div>
        {/* Outputs Preview */}
        {f.outputs && f.outputs.length > 0 && (
          <div className="space-y-2">
            <div className="">
              <div className="space-y-1">
                {f.outputs.map((output, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-muted-foreground">
                      {output.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isReadOnly && containsInput && (
            <Button
              onClick={getReadOnlyResultWithInput}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? <Spinner className="h-4 w-4" /> : "Query"}
            </Button>
          )}

          {!isReadOnly && (
            <Button
              onClick={write}
              disabled={isLoading}
              className="flex-1"
              variant={isPayable ? "default" : "secondary"}
            >
              {isLoading ? (
                <Spinner className="h-4 w-4" />
              ) : isPayable ? (
                "Send Transaction"
              ) : (
                "Write"
              )}
            </Button>
          )}
        </div>

        {/* Transaction Hash Link */}
        {hash && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => ExploreTx(currentChain.id, hash)}
          >
            <ExternalLink className="h-4 w-4" />
            View Transaction
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
