"use client";

import React, { useState, useEffect, useMemo } from "react";
import Pagination from "~~/components/common/Pagination";

interface MarketData {
  rank: number;
  name: string;
  symbol: string;
  price: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  volume24h: number;
  marketCap: number;
  sparkline: number[];
}

const Home = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/market");
        const data = await response.json();

        if (data.status.error_code === "0") {
          setMarketData(data.data);
        } else {
          setError(data.status.error_message);
        }
      } catch (err) {
        setError("Failed to fetch market data");
        console.error("Error fetching market data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  const filteredMarketData = useMemo(() => {
    if (!searchQuery.trim()) return marketData;

    const query = searchQuery.toLowerCase();

    // Try to parse the query as a number to filter price
    const numericQuery = parseFloat(query);

    return marketData.filter(
      // Check if the query matcher the coin name, symbol, or price
      (coin) =>
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query)
    );
  }, [marketData, searchQuery]);

  const PAGE_SIZE = 20;

  // Reset pagination when searching
  useEffect(() => setPage(1), [searchQuery]);
  useEffect(() => setPage(1), [marketData]);

  const totalItems = filteredMarketData.length;
  const visible = useMemo(
    () => filteredMarketData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredMarketData, page]
  );

  const formatCurrency = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  const getPercentColor = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <>
<<<<<<< Updated upstream
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 w-[90%] max-w-7xl mx-auto">
          <div className="container flex flex-col items-center justify-start gap-20 px-4 md:px-8">
            <div className="flex w-full max-w-md flex-col items-center justify-start gap-10">
=======
      <div className="flex items-center flex-col flex-grow pt-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="container flex flex-col items-center justify-start gap-20 px-4 lg:px-8">
            <div className="flex w-full max-w-lg flex-col items-center justify-start gap-10">
>>>>>>> Stashed changes
              <div className="flex flex-col items-center justify-center gap-1 text-center">
                <span className="text-3xl font-bold">BunSwap</span>
                {/* <span className="text-sm text-muted-foreground">
                  StarkDex Market Data for all
                </span> */}
                {/* <span className="text-sm text-muted-foreground">
                  Real-time data, charts, and analytics for Starknet
                </span> */}
              </div>
              <input
                className="flex w-full truncate px-3 py-2 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-lg bg-background ring-2 ring-accent ring-offset-background h-10 text-sm"
                placeholder="Search by token name or symbol"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-1 flex-col items-center justify-between gap-8 border border-border bg-card rounded-xl text-card-foreground w-full max-w-7xl mx-auto">
              <div className="flex flex-col gap-2 w-full">
                {loading ? (
                  Array.from({ length: 16 }, (_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-xl bg-primary/5 dark:bg-muted h-14 w-full"
                    ></div>
                  ))
                ) : error ? (
                  <div className="text-center text-red-500 py-8">
                    Error: {error}
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 px-6 w-full mx-auto">
                    <div className="w-full mx-auto overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4">#</th>
                            <th className="text-left p-4">Coin</th>
                            <th className="text-right p-4">Price</th>
                            <th className="text-right p-4">1H</th>
                            <th className="text-right p-4">24H</th>
                            <th className="text-right p-4">7D</th>
                            <th className="text-right p-4">Volume(24h)</th>
                            <th className="text-right p-4">Market cap</th>
                          </tr>
                        </thead>

                        <tbody>
                          {visible.map((coin, index) => (
                            <tr
                              key={coin.rank}
                              className="border-b border-border hover:bg-muted/50"
                            >
                              <td className="p-4">
                                {index + 1 + (page - 1) * PAGE_SIZE}
                              </td>

                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {coin.name}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    {coin.symbol}
                                  </span>
                                </div>
                              </td>

                              <td className="p-4 text-right font-mono">
                                ${coin.price.toFixed(coin.price < 1 ? 6 : 2)}
                              </td>
                              <td
                                className={`p-4 text-right font-mono ${getPercentColor(coin.percentChange1h)}`}
                              >
                                {formatPercent(coin.percentChange1h)}
                              </td>
                              <td
                                className={`p-4 text-right font-mono ${getPercentColor(coin.percentChange24h)}`}
                              >
                                {formatPercent(coin.percentChange24h)}
                              </td>
                              <td
                                className={`p-4 text-right font-mono ${getPercentColor(coin.percentChange7d)}`}
                              >
                                {formatPercent(coin.percentChange7d)}
                              </td>
                              <td className="p-4 text-right font-mono">
                                {formatCurrency(coin.volume24h)}
                              </td>
                              <td className="p-4 text-right font-mono">
                                {formatCurrency(coin.marketCap)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* ✅ Pagination is added here */}
                    {!loading && !error && (
                      <Pagination
                        currentPage={page}
                        totalItems={totalItems}
                        itemsPerPage={PAGE_SIZE}
                        onPageChange={(p) => setPage(p)}
                      />
                    )}
                  </div>
                )}
              </div>

              <p className="text-sm px-4 font-normal text-muted-foreground">
                Disclaimer: The data presented on StarkDex is provided for
                informational purposes only and is not intended as financial
                advice. While we strive for accuracy, data may occasionally be
                incorrect, unsynchronized, or not fully representative of the
                current market conditions. We encourage users to review our data
                collection and computation methodology for a better
                understanding of how our market data is derived. Please exercise
                due diligence!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
