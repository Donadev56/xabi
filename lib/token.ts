import Web3 from "web3";
import { TransactionRequest } from "@lifi/sdk";
import TransactionSigner from "./signer";
import { Web3Utils } from "@/lib/utils";
import { StTokenAbi } from "@/contracts/abi/token_abi";

export class TokenStateLess {
  public contractAddress: string;
  public web3: Web3;

  constructor(web3: Web3, address: string) {
    this.contractAddress = address;
    this.web3 = web3;
  }

  createContract() {
    return new this.web3.eth.Contract(StTokenAbi, this.contractAddress);
  }

  throwError(error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      throw error;
    }
    return new Error(typeof error == "string" ? error : JSON.stringify(error));
  }

  async getTokenMetadata() {
    try {
      const [name, symbol, decimals] = await Promise.all([
        this.name(),
        this.symbol(),
        this.decimals(),
      ]);
      return {
        name,
        symbol,
        decimals,
      };
    } catch (error) {
      return this.throwError(error);
    }
  }
  async name() {
    try {
      const contract = this.createContract();
      const tokenName = (await contract.methods.name().call()) as any;
      return tokenName as string;
    } catch (error) {
      return this.throwError(error);
    }
  }

  async symbol() {
    try {
      const contract = this.createContract();
      const tokenSymbol = (await contract.methods.symbol().call()) as any;
      return tokenSymbol as string;
    } catch (error) {
      return this.throwError(error);
    }
  }

  async decimals() {
    try {
      const contract = this.createContract();
      const decimalPlaces = await contract.methods.decimals().call();
      return Number(decimalPlaces);
    } catch (error) {
      return this.throwError(error);
    }
  }

  async totalSupply() {
    try {
      const contract = this.createContract();
      const supply = await contract.methods.totalSupply().call();
      return Number(supply) / 1e18;
    } catch (error) {
      return this.throwError(error);
    }
  }

  async balanceOf(address: string) {
    try {
      if (!Web3Utils.isAddressValid(address)) {
        return;
      }
      const contract = this.createContract();
      const balance = await contract.methods.balanceOf(address).call();
      return balance as any as bigint;
    } catch (error) {
      return this.throwError(error);
    }
  }

  async allowance(owner: string, spender: string) {
    try {
      const contract = this.createContract();
      const allowed = await contract.methods.allowance(owner, spender).call();
      return allowed as any as bigint;
    } catch (error) {
      return this.throwError(error);
    }
  }
}

export class TokenStateFull extends TokenStateLess {
  async approve({
    address,
    amount = 100000 * 1e18,
  }: {
    amount?: number;
    address: string;
  }) {
    try {
      const signer = new TransactionSigner(this.web3);

      const contract = this.createContract();
      const ethereum = (window as any)?.ethereum;
      if (!ethereum) {
        throw new Error("Metamask not detected");
      }

      const accounts: string[] = (await ethereum.request({
        method: "eth_accounts",
      })) as any;
      const account = accounts[0];
      const txData = contract!.methods.approve(address, amount).encodeABI();
      return await signer.signAndSendTransaction({
        from: account,
        to: this.contractAddress,
        value: 0,
        data: txData,
      });
    } catch (error) {
      return this.throwError(error);
    }
  }
}
