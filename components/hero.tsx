import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

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
      </motion.div>
    </div>
  );
};
