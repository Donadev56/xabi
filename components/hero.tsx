import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { AiFillCode } from "react-icons/ai";
import { FaArrowRightLong } from "react-icons/fa6";

export const AppHero = () => {
  return (
    <div className="mx-auto max-w-4xl text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
          Interact with{" "}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Smart Contracts
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Explore, read, and write to Ethereum smart contracts with an intuitive
          interface
        </p>
        <div className="flex flex-col gap-4 items-center ">
     <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Powered by </span>
          <Link
            href="https://opennode.dev"
            className="font-semibold hover:text-primary transition-colors"
          >
            opennode.dev
          </Link>
        </div>
<Link href="/dashboard">
  <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm 
                  relative overflow-hidden 
                  bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 
                  bg-[length:200%_100%] 
                  animate-[gradient_3s_ease_infinite] 
                  hover:scale-105 transition-transform duration-300">
    <AiFillCode className="h-4 w-4 z-10 relative" />
    <span className="z-10 relative">Enter Console</span>
    <FaArrowRightLong />

    
    {/* Optional shimmer overlay */}
    <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity 
                    bg-gradient-to-r from-transparent via-white to-transparent 
                    animate-[shimmer_2s_infinite]" />
  </div>
</Link>

        </div>
      

      </motion.div>
    </div>
  );
};
