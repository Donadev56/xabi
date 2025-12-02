"use client";

import Image from "next/image";
import React from "react";
import { Contract, EventLog, Web3 } from "web3";
import { ExtendedChain, TokenAmount } from "@lifi/sdk";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ABIFunction,
  ContractMetadata,
  ContractSourceCode,
  Project,
} from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoReload, IoCopy, IoWallet } from "react-icons/io5";
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
  SaveIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ApiRequestManager } from "@/lib/api_request_manager";
import { useChains } from "@/hooks/use_chains";
import { ChevronDown, MoreVertical, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useConnection } from "@/hooks/use_connection";
import { Blur, Scale, TranslateY } from "@/components/ui/transitions";
import { motion } from "framer-motion";
import useWeb3 from "@/hooks/use_web3";
import TransactionSigner from "@/lib/signer";
import {
  ExploreAddress,
  ExploreTx,
  GetProjects,
  SplitCamelCase,
  UserProjectLocalStorageKey,
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
import { Separator } from "@/components/ui/separator";
import { StListTitle } from "@/components/ui/st_list_title";
import { CryptoAvatar } from "@/components/ui/crypto_avatar";
import { FaFileAlt } from "react-icons/fa";
import { ChainDialogContent } from "@/components/chain_dialog_content";
import { FunctionStateCard } from "@/components/function_card";
import { AppHeader } from "@/components/header";
import { AppHero } from "@/components/hero";
import { TokensDialogContent } from "@/components/tokens_dialog_content";
import { useParams, useSearchParams } from "next/navigation";
import { AddProjectDialog } from "./add_project_dialog";
import { MdSaveAlt } from "react-icons/md";

export function ContractInteractorMain() {
  const contractKey = "contract-address";
  const [address, setAddress] = React.useState(
    () => localStorage.getItem("contract-address") ?? "",
  );
  const [error, setError] = React.useState<string | null>(null);
  const [functions, setFunctions] = React.useState<ABIFunction[]>([]);
  const connection = useConnection();
  const { chains } = useChains();
  const [source, setSource] = React.useState<ContractSourceCode | null>(null);
  const currentChain = connection.currentChain;
  const [isABIVisible, setIsABIVisible] = React.useState(false);
  const [contractMetadata, setContractMetadata] =
    React.useState<ContractMetadata | null>(null);
  const [tokenAmounts, setTokenAmounts] = React.useState<TokenAmount[]>([]);
  const [tokenAmountLoading, setTokenAmountLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const [addProjectDialogOpen, setAddProjectDialogOpen] = React.useState(false);
  const [addProjectNameInputValue, setAddProjectNameInputValue] =
    React.useState("");


  React.useEffect(() => {
    const chainId = searchParams.get("chainId");
    const address = searchParams.get("address");
    if (
      chainId &&
      Number(chainId) &&
      chains.some((e) => e.id === Number(chainId))
    ) {
      connection.setCurrentChain(Number(chainId));
    }

    if (address && Web3Utils.isAddressValid(address)) {
      setAddress(address);
       const targetProject = getSavedProjectInfo(address, Number(chainId ?? "0")) 
      if (targetProject) {
        setFunctions(targetProject.abi);
      }
    }
  }, [searchParams]);

  function getSavedProjectInfo  (address :string ,chainId:number) {
      const projects: Project[] = GetProjects();
      const targetProject = projects.find(
        (e) =>
          e.address.trim().toLowerCase() === address.trim().toLowerCase() &&
          (e.chainId === chainId||
            e.chainId === currentChain.id),
      );
        return (targetProject);
  }



  function showAddProjectDialog() {
      setAddProjectDialogOpen(true);
      setAddProjectNameInputValue(source?.ContractName ?? "");
  }

  const provider = useWeb3();
  const rpcUrl = React.useMemo(() => {
    const rpc = provider.availableRpc;
    let validRpc = rpc;
    const connectedChainRpcUrls = connection?.currentChain?.metamask?.rpcUrls;
    if (
      connectedChainRpcUrls &&
      connectedChainRpcUrls.length > 0 &&
      !connectedChainRpcUrls
        .map((e) => e?.toLowerCase()?.trim())
        .includes(provider?.availableRpc?.trim()?.toLowerCase())
    ) {
      console.warn(
        "Different rpc urls detected :",
        { connectedChainRpcUrls },
        provider.availableRpc,
      );
      provider.getAvailableRpc();
      validRpc = connectedChainRpcUrls[0];
    }
    console.log({ validRpc });
    return validRpc;
  }, [provider.availableRpc, connection.currentChain.id]);
  const web3 = React.useMemo(() => {
    return new Web3(rpcUrl);
  }, [provider.availableRpc, connection.currentChain.id]);

  React.useEffect(() => {
    localStorage.setItem(contractKey, address);
  }, [address]);

  React.useEffect(() => {
    getContractDataWithToast();
    getTokenAmounts();
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
      },
      {
        name: "Read & Inputs",
        value: "read-with-inputs",
        functions: functions.filter(
          (e) =>
            (e.inputs.length > 0 && e.stateMutability === "view") ||
            e.stateMutability === "pure",
        ),
      },
      {
        name: "Write",
        value: "write",
        functions: functions.filter(
          (e) =>
            e.stateMutability === "nonpayable" ||
            e.stateMutability === "payable",
        ),
      },
    ];
  }, [functions]);

  function validateAddress(address: string) {
    return Web3Utils.isAddressValid(address);
  }

  async function getTokenAmounts() {
    try {
      setTokenAmountLoading(true);
      setTokenAmounts([]);
      const manager = new ApiRequestManager();
      const tokens = await manager.getTokensAndAmounts(
        currentChain.id,
        address,
        web3,
      );
      setTokenAmounts(tokens);
    } catch (error) {
      console.error(error);
      const err = (error as any)?.message || String(error);
      setError(err);
      toast.error("Failed to fetch contract data", { description: err });
    } finally {
      setTokenAmountLoading(false);
    }
  }

  const getContractData = async () => {
    try {
      setError(null);
      if (!address.trim()) {
        return;
      }
      if (!validateAddress(address)) {
        throw new Error("Invalid contract address");
      }
      const manager = new ApiRequestManager();

      const source = await manager.getContractSourceCode(
        currentChain?.id ?? 1,
        address,
      );
      setSource(source);
      if (!source) {
        throw new Error("Source not found");
      }
      const abi = JSON.parse(source.ABI);
      const funcs = abi.filter((e: any) => e.type === "function");
      const targetProject = getSavedProjectInfo(address, currentChain.id)
      if (targetProject) {
        setFunctions(targetProject.abi)
      } else {
        setFunctions(funcs);
      }
      const metadata = await manager.getContractMetadata(
        currentChain.id,
        address,
      );
      if (metadata) {
        setContractMetadata(metadata);
      }
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

  function saveProject() {
    try {
      let projects = GetProjects();
        const project: Project = {
          address,
          chainId: currentChain.id,
          abi: functions,
          created_at: Date.now(),
          name:
            addProjectNameInputValue ||
            source?.ContractName ||
            `Project-${projects.length}`,
        };
        projects = projects.filter((e)=> e.address?.trim()?.toLowerCase() !== address?.trim()?.toLowerCase() && e.chainId !== currentChain.id)
        localStorage.setItem(
          UserProjectLocalStorageKey,
          JSON.stringify([...projects, project]),
        );
        toast.success("Project saved successfully");
        setAddProjectDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error((error as any)?.message ?? String(error));
    }
  }
  return (
    <div className="w-full flex flex-col items-center ">
      <div className="w-full max-w-6xl  flex justify-center  md:flex-row flex-col gap-2">
        <div className="mx-auto  w-full  mb-8">
          <Card className=" w-full shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Contract Explorer
              </CardTitle>
              <CardDescription>
                Enter a contract address and select a chain to start interacting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chain Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Network</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {currentChain?.logoURI ? (
                          <img
                            src={currentChain.logoURI}
                            alt={currentChain.name}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-muted" />
                        )}
                        <span className="font-medium">
                          {currentChain?.name || "Select Network"}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DialogTrigger>
                  <ChainDialogContent
                    onSelect={(c) => connection.setCurrentChain(c.id)}
                  />
                </Dialog>
              </div>

              {/* Contract Address Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Contract Address</Label>
                <div className="relative">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x..."
                    className="pl-12 font-mono text-sm"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <FaFileAlt className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* ABI Input (Collapsible) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Contract ABI (Optional)
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsABIVisible(!isABIVisible)}
                    className="h-8 gap-2"
                  >
                    {isABIVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {isABIVisible ? "Hide" : "Show"} ABI
                  </Button>
                </div>

                {isABIVisible && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Textarea
                      value={JSON.stringify(functions, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setFunctions(parsed);
                        } catch (error) {
                          console.log(error);
                          toast.error((error as any)?.message ?? String(error));
                        }
                      }}
                      placeholder="Paste your ABI here..."
                      className="max-h-20 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter ABI JSON if the contract is not verified on-chain
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={getContractDataWithToast}
                className="w-full"
                size="lg"
              >
                Load Contract
              </Button>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Alert variant="destructive">
                <AlertTitle>Error Loading Contract</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </div>

        {/* Contract Details */}
        <Blur className="mx-auto  w-full" displayWhen={!!source}>
          <Card className="mb-8 w-full overflow-hidden">
            <CardHeader>
              <div className="flex flex-col gap-2 items-start justify-between">
                <div>
                  <CardTitle className="text-2xl truncate max-w-full flex items-center gap-3">
                    {SplitCamelCase(
                      source?.ContractName ?? "",
                    ).toLocaleUpperCase()}
                  </CardTitle>
                  <div className="mt-3">
                    <div className="text-muted-foreground ">Balance</div>
                    <div className="font-extrabold flex gap-2 items-center  text-lg">
                      {(
                        Number(contractMetadata?.balance ?? "0") / 1e18
                      ).toLocaleString()}{" "}
                      {currentChain.nativeToken.symbol}{" "}
                      <CryptoAvatar
                        size={20}
                        logoUri={currentChain?.nativeToken?.logoURI}
                      />
                    </div>
                  </div>
                  <Scale
                    className="flex gap-2 mt-2 flex-col"
                    displayWhen={!!contractMetadata?.creatorAddress}
                  >
                    <Label
                      className="text-muted-foreground "
                      htmlFor="creator-address"
                    >
                      Creator
                    </Label>
                    <Input
                      name="creator-address"
                      type="text"
                      value={contractMetadata?.creatorAddress}
                    />
                  </Scale>

                  <div className="my-2 text-[12px] text-muted-foreground">
                    {source?.CompilerVersion}
                  </div>
                </div>
                <div className="space-y-2 w-full">
                  <Label className="text-sm font-medium">Holdings</Label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {tokenAmountLoading ? (
                          <div className="flex items-center gap-3">
                            <Spinner /> Loading
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            $
                            {tokenAmounts
                              .map(
                                (e) =>
                                  (Number(e.amount) / 10 ** e.decimals) *
                                  Number(e.priceUSD ?? "0"),
                              )
                              .reduce((prev, current) => prev + current, 0)
                              .toLocaleString()}{" "}
                            <span className="text-muted-foreground">
                              ({tokenAmounts.length}) tokens
                            </span>
                          </div>
                        )}

                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DialogTrigger>
                    <TokensDialogContent
                      onClick={(c) => console.log(c)}
                      tokens={tokenAmounts}
                    />
                  </Dialog>
                </div>
                <div className="flex items-center gap-2 my-3">
                  <Button
                    size="sm"
                    onClick={showAddProjectDialog}
                    className="gap-2"
                  >
                    <SaveIcon className="h-4 w-4" />
                    Save Project
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => ExploreAddress(currentChain.id, address)}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Source
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Blur>
      </div>

      {/* Functions Tabs */}
      {functions.length > 0 && (
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue={functionsStates[0].value} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
              {functionsStates.map((state) => {
                return (
                  <TabsTrigger
                    key={state.value}
                    value={state.value}
                    className="gap-2 w-full "
                  >
                    {state.name} ({state.functions.length})
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {functionsStates.map((state) => (
              <TabsContent
                key={state.value}
                value={state.value}
                className="mt-6"
              >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {state.functions.length > 0 ? (
                    state.functions.map((f, index) => (
                      <FunctionStateCard
                        key={`${f.name}-${index}`}
                        f={f}
                        functions={functions}
                        rpcUrl={rpcUrl}
                        address={address}
                        account={provider.account}
                        currentChain={currentChain}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <div className="mx-auto max-w-md">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">
                          No Functions
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                          No {state.name.toLowerCase()} found in this contract
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
      <AddProjectDialog
        onConfirm={saveProject}
        contractName={source?.ContractName ?? ""}
        open={addProjectDialogOpen}
        setNameValue={setAddProjectNameInputValue}
        nameValue={addProjectNameInputValue}
        onOpenChange={setAddProjectDialogOpen}
      />
    </div>
  );
}
