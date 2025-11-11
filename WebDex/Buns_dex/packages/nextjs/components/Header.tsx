"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  BoltIcon,
  BugAntIcon,
  CircleStackIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { useTheme } from "next-themes";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { devnet } from "@starknet-react/chains";
import { SwitchTheme } from "./SwitchTheme";
import { useAccount, useNetwork, useProvider } from "@starknet-react/core";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    label: "Dex",
    href: "/dex",
    icon: <CircleStackIcon className="h-4 w-4" />,
  },
  {
    label: "Events",
    href: "/events",
    icon: <BoltIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  return (
    <>
      {menuLinks.map((item) => {
        const isActive = pathname === item?.href;
        return (
          <li key={item?.href}>
            <Link
              href={item?.href}
              passHref
              className={`${
                isActive
                  ? "!bg-gradient-nav !text-white active:bg-gradient-nav shadow-md"
                  : ""
              } py-1.5 px-3 text-sm text-black dark:text-white font-medium rounded-full gap-2 grid grid-flow-col bg-blue-700 dark:bg-sky-500/50 bg-gradient-nav-base hover:bg-gradient-nav hover:text-white`}
            >
              {item?.icon}
              <span>{item?.label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);


  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.network === devnet.network;

  const { provider } = useProvider();
  const { address, status, chainId } = useAccount();
  const { chain } = useNetwork();
  const [isDeployed, setIsDeployed] = useState(true);

  useEffect(() => {
    if (
      status === "connected" &&
      address &&
      chainId === targetNetwork.id &&
      chain.network === targetNetwork.network
    ) {
      provider
        .getClassHashAt(address)
        .then((classHash) => {
          if (classHash) setIsDeployed(true);
          else setIsDeployed(false);
        })
        .catch((e) => {
          console.error("contract check", e);
          if (e.toString().includes("Contract not found")) {
            setIsDeployed(false);
          }
        });
    }
  }, [
    status,
    address,
    provider,
    chainId,
    targetNetwork.id,
    targetNetwork.network,
    chain.network,
  ]);

  return (
    <div className="lg:static top-0 navbar min-h-0 flex-shrink-0 justify-between z-20 w-full max-w-7xl mx-auto">
      <div className="navbar-start w-auto lg:w-1/2 px-4 lg:px-8">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost
              [@media(max-width:379px)]:!px-3 [@media(max-width:379px)]:!py-1
              [@media(max-width:379px)]:!h-9 [@media(max-width:379px)]:!min-h-0
              [@media(max-width:379px)]:!w-10
              ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen((isDrawerOpen) => !isDrawerOpen);
              console.log(isDrawerOpen);
            }}
          >
            {/* <Bars3Icon className="h-1/2" /> */}
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-base-100"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>

        {/* Sidebar Toggle Button */}
        <button
          className="btn btn-ghost btn-sm lg:hidden"
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
            console.log(isSidebarOpen);
          }}
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        <Link
          href="/"
          passHref
          className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0"
        >
          <div className="flex relative w-10 h-10">
            <Image
              alt="SE2 logo"
              className="cursor-pointer"
              fill
              src="/buns.png"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">BunsSwap</span>
            <span className="text-xs">DEX on Starknet</span>
          </div>
        </Link>

        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>

      <div className="navbar-end flex-grow mr-2 gap-4">
        {status === "connected" && !isDeployed ? (
          <span className="bg-[#8a45fc] text-[9px] p-1 text-white">
            Wallet Not Deployed
          </span>
        ) : null}
        <CustomConnectButton />
        <SwitchTheme
          className={`pointer-events-auto ${
            isLocalNetwork ? "mb-1 lg:mb-0" : ""
          }`}
        />
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black opacity-40 backdrop-blur-md"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar Content */}
          <aside
            ref={sidebarRef}
            className={`fixed top-0 left-0 z-50 h-full bg-base-100 shadow-lg w-full sm:w-1/2 lg:w-1/3 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : ""
            }`}
          >
            <div className="grid gap-8 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex relative w-10 h-10">
                  <Image
                    alt="BunSwap logo"
                    className="cursor-pointer"
                    fill
                    src="/buns.png"
                  />
                </div>

                <button
                  className="text-xl text-white font-bold border border-border border hover:bg-black/30  btn btn-ghost btn-sm mb-4 hover:cursor-pointer duration-300 ease-in-out transition-out"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  ✕
                </button>
              </div>

              <nav className="menu menu-vertical grid gap-4 w-full">
                {menuLinks.map(({ label, href, icon }) => {
                  const isActive = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        passHref
                        className={`${
                          isActive
                            ? "!bg-gradient-nav !text-white active:bg-gradient-nav shadow-md"
                            : ""
                        } flex items-center gap-4 py-2 text-md text-black dark:text-white font-medium bg-blue-700 dark:bg-sky-500/50 bg-gradient-nav-base hover:bg-gradient-nav hover:text-white`}
                      >
                        {icon}
                        <span>{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </nav>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};


