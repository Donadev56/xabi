"use client"

import Image from "next/image";
import React from "react";
import { Web3 } from "web3";
import { ExtendedChain, getChains } from "@lifi/sdk";
import { getContractSourceCode } from "@/utils/web3-utils";

export default function Home() {
  const [contractInfo, setContractInfo] = React.useState<{
    address: string;
    chainId: number;
  }>({ address: "", chainId: 1 });
  const [chains, setChains] = React.useState<ExtendedChain[]>([]);
  const currentChain = React.useMemo(() => {
    return chains.find((e) => e.id === contractInfo.chainId);
  }, [chains, contractInfo.chainId]);

  const web3 = React.useMemo(() => {
    return new Web3(currentChain?.metamask.rpcUrls[0]);
  }, [currentChain]);

  React.useEffect(() => {
    async function getAvailableChains() {
      const result = await getChains();
      if (!result) {
        console.error("Chains not found");
        return;
      }
      setChains(result);
    }
  }, []);

  const getContractData = async () => {
    const source = await getContractSourceCode(
      currentChain?.id ?? contractInfo.chainId,
      contractInfo.address,
    );
    if (!source) {
      throw new Error("Source not found");
    }
    const abi = JSON.parse(source.ABI);

    const contract = new web3.eth.Contract(abi, contractInfo.address);
    console.log(contract.methods);
  };

  return (
    <div className="w-full  container ">
      <h1>Welcome to Contract Interactor</h1>

      <div className="text-md ">
        Enter contarct address and chain to see and interact with
      </div>

      <div>
        <input
          type="text"
          placeholder="0x0..."
          onChange={(e) =>
            setContractInfo({ ...contractInfo, address: e.target.value })
          }
          value={contractInfo.address}
        />
        <input
          type="text"
          placeholder="1"
          onChange={(e) =>
            setContractInfo({
              ...contractInfo,
              chainId: Number(e.target.value),
            })
          }
          value={contractInfo.chainId}
        />
      </div>

      <div>
        <button onClick={() => getContractData()}>Submit</button>
      </div>
    </div>
  );
}
