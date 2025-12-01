export interface ContractSourceCode {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  CompilerType: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  ContractFileName: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
  SimilarMatch: string;
}

// Core ABI types
type ABIType = "function" | "event" | "constructor" | "fallback" | "receive";

interface ABIBase {
  type: ABIType;
  name?: string;
  inputs?: ABIParameter[];
  outputs?: ABIParameter[];
  stateMutability?: "pure" | "view" | "nonpayable" | "payable";
}

interface ABIParameter {
  name: string;
  type: string;
  internalType?: string;
  components?: ABIParameter[]; // For tuple types
  indexed?: boolean; // For event parameters
}

// Specific function type
export interface ABIFunction extends ABIBase {
  type: "function";
  name: string;
  inputs: ABIParameter[];
  outputs?: ABIParameter[];
  stateMutability: "pure" | "view" | "nonpayable" | "payable";
}

export type ContractMetadata = {
  address: string;
  chainId: number;
  creatorAddress: string;
  txHash: string;
  blockNumber: string;
  timestamp: string;
  ownerAddress: string;
  balance: string;
};
