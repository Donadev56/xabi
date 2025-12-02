"use client";

import { AppHeader } from "@/components/header";
import { AppHero } from "@/components/hero";
import { ContractInteractorMain } from "@/components/main";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-25 py-8">
        <AppHero />
        <ContractInteractorMain />
      </main>
    </div>
  );
}
