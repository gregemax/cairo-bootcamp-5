import React from "react";

import Link from "next/link";
import { FaGithub, FaXTwitter, FaDiscord } from "react-icons/fa6"

let devYear: number = 2025;
let currentYear: number = new Date().getFullYear();

export interface FooterLinkItem {
  id: number;
  label: string;
  url: string;
}

export interface FooterLinkGroup {
  id: number;
  title: string;
  links: FooterLinkItem[];
}

// footerData.ts (or above Footer component)
export const footerLinks: FooterLinkGroup[] = [
  {
    id: 1,
    title: "Products",
    links: [
      { id: 1, label: "Wallet", url: "https://wallet.uniswap.org/" },
      { id: 2, label: "UniswapX", url: "https://x.uniswap.org/" },
      { id: 3, label: "API", url: "https://www.unichain.org/" },
      { id: 4, label: "Unichain", url: "https://www.unichain.org/" },
    ],
  },
  {
    id: 2,
    title: "Protocol",
    links: [
      { id: 1, label: "Vote", url: "https://vote.uniswapfoundation.org/" },
      { id: 2, label: "Governance", url: "https://uniswap.org/governance" },
      { id: 3, label: "Developers", url: "https://uniswap.org/developers" },
    ],
  },
  {
    id: 3,
    title: "Company",
    links: [
      { id: 1, label: "Docs", url: "https://about.uniswap.org/" },
      { id: 2, label: "GitHub", url: "https://github.com/Olorunshogo/WebDex/" },
      { id: 3, label: "Blog", url: "https://blog.uniswap.org/" },
      {
        id: 4,
        label: "Brand Aseets",
        url: "https://github.com/Olorunshogo/WebDex",
      },
    ],
  },
  {
    id: 4,
    title: "Need help?",
    links: [
      { id: 1, label: "Help Center", url: "https://help.uniswap.org/" },
      {
        id: 2,
        label: "Contact",
        url: "https://support.uniswap.org/hc/en-us/requests/new",
      },
    ],
  },
];

const socialLinks = [
  { id: 1, label: "GitHub", url: "https://github.com/Olorunshogo/WebDex", icon: <FaGithub /> },
  { id: 2, label: "X", url: "https://x.com/Uniswap", icon: <FaXTwitter /> },
  { id: 3, label: "Discord", url: "https://discord.gg/uniswap", icon: <FaDiscord /> },
];


/**
 * Site footer
 */
export const Footer = () => {
  const displayYear = currentYear > devYear ? `${devYear} - ${currentYear}` : `${devYear}`;

  return (
    <div className="min-h-0 py-5 px-4 lg:px-8 mt-12 mb-11 lg:mb-0 w-full max-w-7xl mx-auto">
      <div className="w-full">

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 text-sm font-medium">
          <div className="flex items-center gap-2 text-white">
            &copy;
            <span>{displayYear}</span>
            Cohort 7 blockheaderWeb3
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={"/privacy"}
              className="text-gray-500 hover:text-white cursor-pointer duration-300 ease-in-out transition-all"
            >
              Privacy Policy
            </Link>

            <Link
              href={"/trademark"}
              className="text-gray-500 hover:text-white cursor-pointer duration-300 ease-in-out transition-all"
            >
              Trademark Policy
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
