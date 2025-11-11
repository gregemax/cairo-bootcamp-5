"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center mt-8">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

/**
 * Dynamically import the 4 components.
 * ssr: false to ensure client rendering (since they use client hooks).
 * Provide a tiny loading component as fallback.
 */

const StrkToBnsEvents = dynamic(
  () => import("~~/components/events/StrkToBnsEvents"),
  { ssr: false, loading: () => <Loader /> }
);
const BnsToStrkEvents = dynamic(
  () => import("~~/components/events/BnsToStrkEvents"),
  { ssr: false, loading: () => <Loader /> }
);
const LiquidityProvidedEvents = dynamic(
  () => import("~~/components/events/LiquidityProvidedEvents"),
  { ssr: false, loading: () => <Loader /> }
);
const LiquidityRemovedEvents = dynamic(
  () => import("~~/components/events/LiquidityRemovedEvents"),
  { ssr: false, loading: () => <Loader /> }
);

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("strk-to-bns");

  const tabs = [
    { id: "strk-to-bns", label: "STRK → BNS", Component: StrkToBnsEvents },
    { id: "bns-to-strk", label: "BNS → STRK", Component: BnsToStrkEvents },
    {
      id: "liquidity-provided",
      label: "Liquidity Provided",
      Component: LiquidityProvidedEvents,
    },
    {
      id: "liquidity-removed",
      label: "Liquidity Removed",
      Component: LiquidityRemovedEvents,
    },
  ];

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      {/* Tabs */}
      <div className="w-full max-w-7xl px-4">
        <div className="flex flex-wrap items-center gap-2 justify-center">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`btn btn-sm btn-outline transition-all duration-200 hover:scale-105 ${
                activeTab === t.id
                  ? "btn-active bg-gradient-nav text-white shadow-lg"
                  : "hover:bg-gradient-nav hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl px-4 mt-8">
        <Suspense fallback={<Loader />}>
          {/* Render only the active component */}
          {tabs.map((t) => {
            if (t.id !== activeTab) return null;
            const Component = t.Component;
            return (
              <div key={t.id} className="transition-opacity duration-200">
                <Component />
              </div>
            );
          })}
        </Suspense>
      </div>
    </div>
  );
};

export default EventsPage;
