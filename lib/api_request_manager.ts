import { ContractMetadata, ContractSourceCode } from "@/types/types";
import { Token, TokenAmount } from "@lifi/sdk";
import Web3 from "web3";
import { TokenStateFull } from "./token";

export class ApiRequestManager {
  async getContractSourceCode(chain: number, address: string) {
    try {
      const response = await fetch(`
            https://api.openscan.app/contracts/source_code?chainId=${chain}&address=${address}`);
      if (!response.ok) {
        throw new Error(await response.json());
      }
      const data = await response.json();
      const source = data.result[0];
      return source as ContractSourceCode;
    } catch (error) {
      console.error("Error fetching contract source code:", error);
      return null;
    }
  }
  async getContractMetadata(chain: number, address: string) {
    try {
      const response = await fetch(`
            https://api.openscan.app/contracts/contract_metadata?chainId=${chain}&address=${address}`);
      if (!response.ok) {
        throw new Error(await response.json());
      }
      const json = await response.json();
      const data = json.result;
      return data as ContractMetadata;
    } catch (error) {
      console.error("Error fetching contract metadata :", error);
      return null;
    }
  }

  async getReceivedTokensOf(chain: number, address: string) {
    try {
      const response = await fetch(
        `https://api.openscan.app/contracts/received_tokens?chainId=${chain}&address=${address}`,
      );
      if (!response.ok) {
        throw new Error(await response.json());
      }
      const json = await response.json();
      const data = json.result;
      return data as Token[];
    } catch (error) {
      console.error("Error fetching contract metadata :", error);
      return null;
    }
  }

  async getListTokenBalance(tokens: Token[], address: string, web3: Web3) {
    let tokenAmounts: TokenAmount[] = [];
    for (const token of tokens) {
      const contract = new TokenStateFull(web3, token.address);
      const balance = await contract.balanceOf(address);
      if (balance instanceof Error || !balance) {
        tokenAmounts.push({ ...token, amount: BigInt(0) });
        continue;
      }
      tokenAmounts.push({ ...token, amount: balance });
      console.log({ tokenAmounts });
    }
    return tokenAmounts;
  }

  async getTokensAndAmounts(chain: number, address: string, web3: Web3) {
    try {
      const tokens = await this.getReceivedTokensOf(chain, address);
      if (!tokens) {
        throw new Error("Tokens not found");
      }
      return await this.getListTokenBalance(tokens, address, web3);
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
