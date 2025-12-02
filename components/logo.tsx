import { Code } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex  justify-center w-6 h-6 lg:h-8 lg:w-8 bg-primary rounded-[5px] gap-2 items-center ">
      <Code className="h-4 w-4 lg:h-6 lg:w-6 text-primary-foreground" />
    </div>
  );
};
