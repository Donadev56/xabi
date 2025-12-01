import { Code, Wallet } from "lucide-react";
import ThemeToggle from "./theme_toogle";
import { Card } from "./ui/card";
import { copy } from "@/lib/app-utils";
import { Web3Utils } from "@/lib/utils";
import useWeb3 from "@/hooks/use_web3";

export const AppHeader = () => {
  const provider = useWeb3();
  return (
    <div className="w-full z-1000 fixed px-2 py-2  bg-background/80 backdrop-blur-sm border-b  top-0 left-0 right-0 flex justify-between">
      <div className="flex shrink-0 items-center gap-2 ">
        <div className="flex  justify-center w-6 h-6 lg:h-8 lg:w-8 bg-primary rounded-[5px] gap-2 items-center ">
          <Code className="h-4 w-4 lg:h-6 lg:w-6 text-primary-foreground" />
        </div>
        <div className="font-bold lg:text-2xl text-lg">xABI</div>
      </div>

      <div className="flex items-center gap-2">
        <div className="ml-3">
          <ThemeToggle size={30} />
        </div>

        <Card className="border-none bg-muted/50 px-4 py-2">
          <div className="flex items-center gap-3">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span
              className="cursor-pointer font-mono text-sm hover:text-primary transition-colors"
              onClick={() => copy(provider.account)}
            >
              {Web3Utils.truncatedAddress(provider.account)}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
