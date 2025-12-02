"use client";

import React, { useState, useEffect } from "react";
import { SideBarApp } from "@/components/sidebar";
import {
  MdSpaceDashboard,
  MdOutlineEdit,
  MdDelete,
  MdAdd,
  MdCheck,
  MdClose,
  MdRefresh,
} from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { cn, Web3Utils } from "@/lib/utils";
import useWeb3 from "@/hooks/use_web3";
import { useConnection } from "@/hooks/use_connection";
import { FaCube } from "react-icons/fa";

interface CustomRPCNode {
  id: string;
  name: string;
  url: string;
  chainId: number;
  isActive: boolean;
  createdAt: number;
}

export default function NodeConfigView() {
  const web3 = useWeb3();
  const connection = useConnection();
  const currentChain = connection.currentChain;

  const [isTestingRPC, setIsTestingRPC] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latency?: number;
  } | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const [customNodeName, setCustomNodeName] = useState("");
  const [customNodeUrl, setCustomNodeUrl] = useState("");
  const [isCustomNodeActive, setIsCustomNodeActive] = useState(false);

  const [customNodes, setCustomNodes] = useState<CustomRPCNode[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("custom-rpc-nodes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const currentChainCustomNodes = customNodes.filter(
    (node) => node.chainId === currentChain.id,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("custom-rpc-nodes", JSON.stringify(customNodes));
    }
  }, [customNodes]);

  const chainRPCUrls = currentChain?.metamask?.rpcUrls || [];
  const currentRPC = web3.availableRpc;

  const testRPCUrl = async (url: string) => {
    if (!url) return;

    setIsTestingRPC(true);
    setTestResult(null);

    try {
      const startTime = Date.now();
      const isAvailable = await Web3Utils.isRpcUrlAvailable(url);
      const latency = Date.now() - startTime;

      if (isAvailable) {
        setTestResult({
          success: true,
          message: "RPC URL is accessible",
          latency,
        });
        toast.success(`RPC URL test successful (${latency}ms)`);
      } else {
        setTestResult({
          success: false,
          message: "RPC URL is not accessible",
          latency,
        });
        toast.error("RPC URL test failed");
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: (error as Error).message || "Failed to test RPC URL",
      });
      toast.error("Error testing RPC URL");
    } finally {
      setIsTestingRPC(false);
    }
  };

  const switchToRPC = async (url: string) => {
    try {
      web3.setAvailableRpc(url);
      toast.success("RPC URL switched successfully");

      await testRPCUrl(url);
    } catch (error) {
      toast.error("Failed to switch RPC URL");
    }
  };

  const addCustomNode = async () => {
    setIsAdding(true);

    try {
      if (!customNodeName.trim() || !customNodeUrl.trim()) {
        throw new Error("Please enter both name and URL");
      }

      if (!Web3Utils.isValidUrl(customNodeUrl)) {
        throw new Error("Please enter a valid URL");
      }

      const isAvailable = await Web3Utils.isRpcUrlAvailable(customNodeUrl);

      if (!isAvailable) {
        throw new Error("RPC URL is not accessible. Please check the URL.");
      }
      const allNodes = [
        ...customNodes.map((e) => e.url),
        ...currentChain?.metamask?.rpcUrls,
      ].map((e) => e.toLowerCase());
      if (allNodes.includes(customNodeUrl.toLowerCase())) {
        throw new Error("Node already exist");
      }
      const newNode: CustomRPCNode = {
        id: Date.now().toString(),
        name: customNodeName,
        url: customNodeUrl,
        chainId: currentChain.id,
        isActive: isCustomNodeActive,
        createdAt: Date.now(),
      };

      let updatedNodes = [...customNodes];
      if (isCustomNodeActive) {
        updatedNodes = updatedNodes.map((node) => ({
          ...node,
          isActive: node.chainId === currentChain.id ? false : node.isActive,
        }));
      }

      updatedNodes.push(newNode);
      setCustomNodes(updatedNodes);

      if (isCustomNodeActive) {
        web3.setAvailableRpc(customNodeUrl);
      }

      toast.success("Custom node added successfully");

      setCustomNodeName("");
      setCustomNodeUrl("");
      setIsCustomNodeActive(false);
    } catch (error) {
      console.error(error);
      toast.error((error as any)?.message ?? String(error));
    } finally {
      setIsAdding(false);
    }
  };

  const updateCustomNode = (nodeId: string) => {
    const node = customNodes.find((n) => n.id === nodeId);
    if (!node) return;

    if (!customNodeName.trim() || !customNodeUrl.trim()) {
      toast.error("Please enter both name and URL");
      return;
    }

    if (!Web3Utils.isValidUrl(customNodeUrl)) {
      toast.error("Please enter a valid URL");
      return;
    }

    const updatedNodes = customNodes.map((n) => {
      if (n.id === nodeId) {
        return {
          ...n,
          name: customNodeName,
          url: customNodeUrl,
          isActive: isCustomNodeActive,
        };
      }
      if (isCustomNodeActive && n.chainId === currentChain.id) {
        return { ...n, isActive: false };
      }
      return n;
    });

    setCustomNodes(updatedNodes);
    setEditingNodeId(null);

    if (isCustomNodeActive) {
      web3.setAvailableRpc(customNodeUrl);
    }

    toast.success("Custom node updated successfully");

    setCustomNodeName("");
    setCustomNodeUrl("");
    setIsCustomNodeActive(false);
  };

  const deleteCustomNode = (nodeId: string) => {
    const updatedNodes = customNodes.filter((n) => n.id !== nodeId);
    setCustomNodes(updatedNodes);
    toast.success("Custom node deleted");
  };

  const editCustomNode = (node: CustomRPCNode) => {
    setEditingNodeId(node.id);
    setCustomNodeName(node.name);
    setCustomNodeUrl(node.url);
    setIsCustomNodeActive(node.isActive);
  };

  const cancelEditing = () => {
    setEditingNodeId(null);
    setCustomNodeName("");
    setCustomNodeUrl("");
    setIsCustomNodeActive(false);
  };

  const refreshRPCs = async () => {
    try {
      await web3.getAvailableRpc();
      toast.success("RPC list refreshed");
    } catch (error) {
      toast.error("Failed to refresh RPC list");
    }
  };

  return (
    <>
      <SideBarApp icon={<FaCube />} label="Node Config">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold my-2">Node Configuration</h1>
            <p className="text-muted-foreground">
              Configure and manage RPC nodes for{" "}
              {currentChain?.name || "current network"}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Current RPC Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current RPC Status</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshRPCs}
                    className="gap-2"
                  >
                    <MdRefresh className="h-4 w-4" />
                    Refresh
                  </Button>
                </CardTitle>
                <CardDescription>Current active RPC endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Current RPC URL
                    </Label>
                    <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                      {currentRPC}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "bg-orange-400",
                        web3.isConnected && "bg-green-400 ",
                      )}
                      variant={web3.isConnected ? "default" : "secondary"}
                    >
                      {web3.isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                    <Badge variant="outline">
                      Chain ID: {currentChain?.id}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => testRPCUrl(currentRPC)}
                    variant="outline"
                    className="w-full gap-2"
                    disabled={isTestingRPC}
                  >
                    {isTestingRPC ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Testing...
                      </>
                    ) : (
                      <>Test Connection</>
                    )}
                  </Button>

                  {testResult && (
                    <Alert
                      variant={testResult.success ? "default" : "destructive"}
                    >
                      <AlertTitle>
                        {testResult.success
                          ? "✓ Connection Successful"
                          : "✗ Connection Failed"}
                      </AlertTitle>
                      <AlertDescription>
                        {testResult.message}
                        {testResult.latency && ` (${testResult.latency}ms)`}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add/Edit Custom Node */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingNodeId ? "Edit Custom Node" : "Add Custom Node"}
                </CardTitle>
                <CardDescription>
                  {editingNodeId
                    ? "Update your custom RPC node configuration"
                    : "Add a custom RPC node for the current network"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="node-name">Node Name</Label>
                    <Input
                      id="node-name"
                      placeholder="My Custom Node"
                      value={customNodeName}
                      onChange={(e) => setCustomNodeName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="node-url">RPC URL</Label>
                    <Input
                      id="node-url"
                      placeholder="https://rpc.example.com"
                      value={customNodeUrl}
                      onChange={(e) => setCustomNodeUrl(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="node-active">Set as active node</Label>
                    <Switch
                      id="node-active"
                      checked={isCustomNodeActive}
                      onCheckedChange={setIsCustomNodeActive}
                    />
                  </div>

                  <div className="flex gap-2">
                    {editingNodeId ? (
                      <>
                        <Button
                          onClick={() => updateCustomNode(editingNodeId)}
                          className="flex-1 gap-2"
                        >
                          <MdCheck className="h-4 w-4" />
                          Update Node
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          variant="outline"
                          className="gap-2"
                        >
                          <MdClose className="h-4 w-4" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={addCustomNode}
                        className="w-full gap-2"
                        disabled={isAdding}
                      >
                        {isAdding ? (
                          <>
                            <Spinner className="h-4 w-4" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <MdAdd className="h-4 w-4" />
                            Add Custom Node
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          <Tabs defaultValue="default" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="default">
                Default ({chainRPCUrls.length})
              </TabsTrigger>
              <TabsTrigger value="custom">
                Custom ({currentChainCustomNodes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="default" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available RPC URLs</CardTitle>
                  <CardDescription>
                    Default RPC endpoints provided by {currentChain?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chainRPCUrls.map((url, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          url === currentRPC
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-mono text-sm break-all">
                              {url}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>#{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => testRPCUrl(url)}
                            variant="outline"
                            size="sm"
                            disabled={isTestingRPC}
                          >
                            Test
                          </Button>
                          <Button
                            onClick={() => switchToRPC(url)}
                            variant="secondary"
                            size="sm"
                            disabled={url === currentRPC}
                            className={cn(
                              url === currentRPC &&
                                "bg-green-400/10 text-green-400",
                            )}
                          >
                            {url === currentRPC ? "Active" : "Switch"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom RPC Nodes</CardTitle>
                  <CardDescription>
                    Your custom RPC endpoints for {currentChain?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentChainCustomNodes.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No custom nodes configured for this network.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentChainCustomNodes.map((node) => (
                        <div
                          key={node.id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            node.isActive
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-medium">{node.name}</div>
                              {node.isActive && (
                                <Badge variant="default">Active</Badge>
                              )}
                            </div>
                            <div className="font-mono text-sm text-muted-foreground break-all">
                              {node.url}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Added:{" "}
                              {new Date(node.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => editCustomNode(node)}
                              variant="outline"
                              size="sm"
                            >
                              <MdOutlineEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => switchToRPC(node.url)}
                              variant="secondary"
                              size="sm"
                              disabled={node.isActive}
                            >
                              {node.isActive ? "Active" : "Switch"}
                            </Button>
                            <Button
                              onClick={() => deleteCustomNode(node.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <MdDelete className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-muted-foreground">
                    Custom nodes are stored locally in your browser
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <Alert className="mt-8">
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              Changing RPC nodes may affect transaction speeds and reliability.
              Always test your connection before switching to a custom node.
            </AlertDescription>
          </Alert>
        </div>
      </SideBarApp>
    </>
  );
}
