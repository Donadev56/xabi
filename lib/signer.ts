import { TransactionRequest } from "@lifi/sdk";
import Web3 from "web3";

class TransactionSigner {
  public web3: Web3;
  public ethereum: any;
  constructor(web3: Web3) {
    this.web3 = web3;
    this.ethereum = (window as any).ethereum;
  }

  signAndSendTransaction = async ({
    from,
    to,
    value,
    data,
  }: {
    from: string;
    to: string;
    value: number;
    data: string;
  }): Promise<string> => {
    try {
      const ethereum = this.ethereum;
      if (!ethereum) {
        throw Error("MetaMask not found");
      }
      const params = {
        from,
        to,
        value,
        data,
      };

      const estimatedGas = await this.web3.eth.estimateGas(params);

      console.log("estimate fees: ", estimatedGas);
      const gasLimit = Math.floor(Number(estimatedGas));

      console.log("Estimated gas:", estimatedGas);
      console.log("Adjusted gas limit:", gasLimit);

      const receipt = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            ...params,
            value: this.web3.utils.toHex(params.value),
            gas: this.web3.utils.toHex(gasLimit),
          },
        ],
      });

      if (!receipt) {
        throw Error("Transaction Failed");
      }
      return typeof receipt === "string" ? receipt : receipt.transactionHash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  sendTransaction = async (data: TransactionRequest): Promise<string> => {
    try {
      console.log(data.chainId);
      const ethereum = this.ethereum;
      if (!ethereum) {
        throw Error("MetaMask not found");
      }
      const params = {
        ...data,
      };

      const receipt = await ethereum.request({
        method: "eth_sendTransaction",
        params: [params],
      });

      if (!receipt) {
        throw Error("Transaction Failed");
      }
      return typeof receipt === "string" ? receipt : receipt.transactionHash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default TransactionSigner;
