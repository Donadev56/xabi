"use client";

import { ContractInteractorMain } from "@/components/main";
import { SideBarApp } from "@/components/sidebar";
import React from "react";

import { MdSpaceDashboard } from "react-icons/md";

export default function DashBoardView() {
  
  return (
    <>
      <SideBarApp icon={<MdSpaceDashboard />} label={"Dashboard"}>
        <ContractInteractorMain  />
      </SideBarApp>
    </>
  );
}
