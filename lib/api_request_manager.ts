import { ContractSourceCode } from "@/types/types";

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
}
