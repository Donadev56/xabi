import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ContractSourceCode, Project } from "@/types/types.js";
import { ZeroAddress } from "ethers";
import { getChains } from "@lifi/sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class Web3Utils {
  static truncatedAddress = (address: string, max = 5): string => {
    return this._truncatedAddress(
      this.isAddressValid(address) ? address : ZeroAddress,
      max,
    );
  };

  static _truncatedAddress = (address: string, max = 5): string => {
    if (this.isAddressValid(address)) {
      return `${address.slice(0, max)}...${address.slice(address.length - max, address.length)}`;
    }
    return "Invalid address";
  };

  static isAddressValid = (address: string): boolean => {
    return address.startsWith("0x") && address.length == 42;
  };

  static async isRpcUrlAvailable(rpcUrl: string) {
    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_blockNumber",
          params: [],
          id: 1,
        }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      return !!data.result;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  static async findAvailableRpc(rpcUrls: string[]) {
    try {
      for (const rpc of rpcUrls) {
        const isAvailable = await Web3Utils.isRpcUrlAvailable(rpc);
        if (isAvailable) {
          return rpc;
        }
      }
    } catch (error) {
      console.error(error);
      return rpcUrls[0];
    }
  }

  static async getWeb3Accounts() {
    return (await (window as any)?.ethereum.request({
      method: "eth_requestAccounts",
      params: [],
    })) as any as string[] | undefined;
  }
  static isValidUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }
}

export function ImageOf(chainId: number) {
  return `/img/${chainId}.svg`;
}

export function convertTimestampToHumanTime(timestamp: number) {
  const now = new Date();
  const timeDifference = now.getTime() - timestamp * 1000;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} sec`;
  } else if (minutes < 60) {
    return `${minutes} min`;
  } else if (hours < 24) {
    return `${hours} h`;
  } else if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"}`;
  } else if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"}`;
  } else {
    return `${years} year${years === 1 ? "" : "s"}`;
  }
}
export const toHumainDate = (date: string) => {
  const dateObj = new Date(date + "-01");

  const options = { year: "numeric", month: "long" };
  const formattedDate = dateObj
    .toLocaleDateString("en-US", options as any)
    .replace(",", "");

  return formattedDate;
};

export const shortName = (name: string) => {
  if (typeof name == "undefined" || name.length == 0) {
    return "U".toUpperCase();
  }
  if (name.length > 1) {
    return name.slice(0, 1).toUpperCase();
  } else if (name.length == 1) {
    return name[0].toUpperCase();
  }
};

export async function imageToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export function SplitCamelCase(str: string) {
  if (!str) {
   return "No name"
  }
  if (!str?.trim()) {
    return str;
  }
  str = str.replaceAll("_", " ");
  const spaced = str.replace(/([a-z])([A-Z])/g, "$1 $2");

  return spaced[0]?.toUpperCase() + spaced.slice(1).toLowerCase();
  // add space before capital letters
  const capitalized = spaced.replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
  return capitalized;
}

export const Ethereum = {
  key: "eth",
  chainType: "EVM",
  name: "Ethereum",
  coin: "ETH",
  id: 1,
  mainnet: true,
  logoURI:
    "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg",
  tokenlistUrl: "https://gateway.ipfs.io/ipns/tokens.uniswap.org",
  multicallAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
  relayerSupported: false,
  metamask: {
    chainId: "0x1",
    blockExplorerUrls: ["https://etherscan.io/"],
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://ethereum-rpc.publicnode.com", "https://eth.drpc.org"],
  },
  nativeToken: {
    address: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    symbol: "ETH",
    decimals: 18,
    name: "ETH",
    coinKey: "ETH",
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    priceUSD: "4611.55832425",
  },
  diamondAddress: "0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE",
  permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  permit2Proxy: "0x89c6340B1a1f4b25D36cd8B063D49045caF3f818",
};
export async function ExploreAddress(chainId: number, address: string) {
  const chainList = await getChains();
  const chain = chainList.find((c) => c.id === chainId);
  if (!chain) {
    return;
  }
  const explorerUrl = chain.metamask.blockExplorerUrls?.[0];
  if (!explorerUrl) {
    return;
  }
  const url = `${explorerUrl.replace(/\/+$/, "")}/address/${address}`;
  open(url, "_blank");
}
export async function ExploreTx(chainId: number, hash: string) {
  const chainList = await getChains();

  const chain = chainList.find((c) => c.id === chainId);
  if (!chain) {
    return;
  }
  const explorerUrl = chain.metamask.blockExplorerUrls?.[0];
  if (!explorerUrl) {
    return;
  }
  const url = `${explorerUrl.replace(/\/+$/, "")}/tx/${hash}`;
  open(url, "_blank");
}

export const UserProjectLocalStorageKey =
  "user-evm-xAbi-smart-contract-projects-key";
export function GetProjects() {
  const projects: Project[] = JSON.parse(
    localStorage.getItem(UserProjectLocalStorageKey) ?? "[]",
  );
  return projects;
}
