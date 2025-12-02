"use client";
import { AppHeader } from "@/components/header";
import { Logo } from "@/components/logo";
import { ContractInteractorMain } from "@/components/main";
import ThemeToggle from "@/components/theme_toogle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StListTitle } from "@/components/ui/st_list_title";
import { useIsMobile } from "@/hooks/is_mobile";
import useWeb3 from "@/hooks/use_web3";
import { copy } from "@/lib/app-utils";
import {
  cn,
  GetProjects,
  UserProjectLocalStorageKey,
  Web3Utils,
} from "@/lib/utils";
import {
  HomeIcon,
  LayoutDashboard,
  MoreHorizontal,
  Trash2,
  Wallet,
} from "lucide-react";
import React from "react";
import { BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";
import { FaCubes } from "react-icons/fa";
import { IoAdd, IoWallet } from "react-icons/io5";
import { RiDashboard2Fill, RiRobot3Fill } from "react-icons/ri";
import { FaPenNib } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { MdHomeFilled } from "react-icons/md";
import { IoCubeSharp } from "react-icons/io5";
import Link from "next/link";
import { StTokenAbi } from "@/contracts/abi/token_abi";
import { LoaderView } from "./loader_view";
import { useChains } from "@/hooks/use_chains";
import { CryptoAvatar } from "./ui/crypto_avatar";
import { useProjects } from "@/hooks/use_projects";
import { FaGithub } from "react-icons/fa";

const SideBarApp = ({
  children,
  label,
  icon,
}: {
  children: React.ReactNode;
  label: React.ReactNode;
  icon: React.ReactNode;
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(true);
  const provider = useWeb3();

  React.useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="flex overflow-hidden max-h-svh w-full">
      <SideBarComponent
        isMobile={isMobile}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        label={<div>{label}</div>}
      />
      <div className="p-6 max-h-svh overflow-scroll flex items-center flex-col w-full">
        <div className="w-full flex items-center max-w-6xl   justify-between  py-2 mb-3 border rounded-[10px] p-2 bg-card ">
          <div className="flex gap-2 items-center ">
            {" "}
            {icon} <div>{label} </div>{" "}
          </div>
          <Card className="border-none rounded-full   bg-muted/50 px-4 py-2">
            <div className="flex items-center gap-3">
              <IoWallet className="h-4 w-4 text-muted-foreground" />
              <span
                className="cursor-pointer font-mono text-[12px] hover:text-primary transition-colors"
                onClick={() => copy(provider.account)}
              >
                {Web3Utils.truncatedAddress(provider.account, 4)}
              </span>
            </div>
          </Card>
          <div>
            <BsReverseLayoutSidebarInsetReverse
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
const SideBarComponent = ({
  label,
  isOpen,
  setIsOpen,
  isMobile,
}: {
  label?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
}) => {
  const { chains } = useChains();
  const {projects, relaodProjects, deleteProject} = useProjects()
  

  const options = [
    {
      label: "Home",
      link: "/",
      icon: MdHomeFilled,
    },
    {
      label: "Dashbaord",
      link: "/dashboard",
      icon: MdSpaceDashboard,
    },
    {
      label: "Node Config",
      link: "/dashboard/nodes",
      icon: IoCubeSharp,
    },
    {
      label: "AI Contract Creator",
      link: "#",
      icon: FaPenNib,
    },
  ];
  const handleStorageChange = (_: StorageEvent) => {
      relaodProjects();
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, []);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          " fixed left-0 right-0 bottom-0 top-0 bg-background/80 transition-[10s]  backdrop-blur-[5px] -z-999 opacity-0 ",
          isMobile && isOpen && "opacity-100 z-999 w-full  ",
        )}
      />

      <div
        className={cn(
          "min-w-[270px] max-h-  pr-0 opacity-100  overflow-hidden  transition-[10s]  max-w-[270px] max-h-svh h-svh ",
          !isOpen && "w-0 min-w-0 opacity-0 p-0 ",
          isMobile && "fixed left-0 z-1000",
        )}
      >
        <div
          className={cn(
            "h-svh p-3 max-h-svh overflow-y-scroll border-r w-full bg-card",
            !isOpen && "w-0 min-w-0 p-0  ",
          )}
        >
          <div className="w-full p-2">
            <StListTitle
              className="  py-1  rounded-[10px] "
              leading={<Logo />}
              title={<div className="font-bold text-md  ">xABI</div>}
              subTitle={label}
              actions={[
                <Link href={"https://github.com/Donadev56/xabi"}>
                <Button className="rounded-full border  w-8 h-8 " variant={"ghost"}>
                  <FaGithub />
                </Button>
                 </Link>

                ,
              <ThemeToggle size={30} />]}
            />
          </div>
          <div className="px-4 flex gap-2 flex-col items-center ">
            <Link
              href={"https://openscan.app/dashboard/contract"}
              className="w-full"
            >
              <Button className="w-full ">
                <IoAdd /> Create Token
              </Button>
            </Link>
            <div className="w-full mt-4">
              <div className="w-full font-bold text-sm text-muted-foreground">
                NAVIGATION
              </div>
              <div className="flex gap-3  my-3 flex-col">
                {options.map((e) => {
                  const coming = e.link === "#";
                  const active = location.pathname === e.link;
                  return (
                    <Link
                      href={e.link}
                      className={cn(
                        "w-full",
                        coming && "cursor-not-allowed opacity-50 ",
                      )}
                    >
                      <div
                        className={cn(
                          "w-full text-mg px-3 py-2  rounded-(--radius)  flex items-center gap-2  ",
                          active && "border-primary bg-primary/10 border",
                        )}
                      >
                        <e.icon size={22} /> {e.label}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="w-full">
              <div className="w-full font-bold =text-sm text-muted-foreground">
                PROJECTS
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 my-3 pb-30">
                {projects.length ===  0 ? 
                <div className="w-full border border-dashed p-3 rounded-[5px] text-muted-foreground text-center ">
                  No Saved Projects
                </div> :
                projects
                  .sort((a, b) => b.created_at - a.created_at)
                  .map((e) => {
                    const chain = chains.find((p) => p.id === e.chainId);
                    return (
                      <Link
                        href={`/dashboard?chainId=${e.chainId}&address=${e.address}`}
                        className="w-full"
                      >
                        <StListTitle
                          className="border group  py-1 bg-muted rounded-[5px] "
                          leading={
                            <CryptoAvatar
                              size={32}
                              className="bg-muted rounded-[5px] "
                              logoUri={chain?.logoURI}
                            />
                          }
                          title={
                            <div className="font-bold text-[15px] ">
                              {e.name}
                            </div>
                          }
                          subTitle={
                            <div>
                              {Web3Utils.truncatedAddress(e.address, 5)}
                            </div>
                            
                          }

                          actions={[
                            <Trash2 onClick={()=> deleteProject(e.id)} className={cn("hover:text-red-400 ", !isMobile && "opacity-0", "group-hover:opacity-100")} size={17} />
                          ]}
                        />
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { SideBarApp, SideBarComponent };
