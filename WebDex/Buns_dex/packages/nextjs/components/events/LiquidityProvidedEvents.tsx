"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Address } from "~~/components/scaffold-stark/Address";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark/useScaffoldEventHistory";
import { formatEther } from "ethers";
import Pagination from "../common/Pagination";

type EventWithArgs = {
  args: Record<string, any>;
}

const PAGE_SIZE = 10;

const LiquidityProvidedEvents: React.FC = () => {
  const {
    data: liquidityProvideEvent,
    isLoading: isLquidityProvideEventLoading,
  } = useScaffoldEventHistory({
    contractName: "Dex",
    eventName: "LiquidityProvided",
    fromBlock: 2650733n,
  });

    const events: EventWithArgs[] = useMemo(() => (liquidityProvideEvent as EventWithArgs[]) || [], [liquidityProvideEvent]);

    const [page, setPage] = useState<number>(1);

    // Reset page when data changes
    useEffect(() => setPage(1), [liquidityProvideEvent]);

    const totalItems = events.length;
    const totalPage = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    const visible = useMemo(
      () => events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      [events, page]
    );

  return (
    <div>
      <div className="text-center mb-4">
        <span className="block text-2xl font-bold">
          Liquidity Provided Events
        </span>
      </div>
      {isLquidityProvideEventLoading ? (
        <div className="flex justify-center items-center mt-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-lg">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="bg-secondary text-white">S/N</th>
                  <th className="bg-secondary text-white">Address</th>
                  <th className="bg-secondary text-white">Amount of STRK in</th>
                  <th className="bg-secondary text-white">Amount of BNS in</th>
                  <th className="bg-secondary text-white">Liquidity Minted</th>
                </tr>
              </thead>
              <tbody>
                {!events || events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No events found
                    </td>
                  </tr>
                ) : (
                  visible.map((event, localIndex) => {
                    const globalIndex = (page - 1) * PAGE_SIZE + localIndex + 1;
                    const liquidity_provider = event.args?.liquidity_provider;
                    return (
                      <tr key={globalIndex}>
                        <td className="text-center">{globalIndex}</td>
                        <td className="text-center">
                          <Address
                            address={`0x${BigInt(liquidity_provider).toString(16)}`}
                          />
                        </td>
                        <td>{formatEther(event.args.strk_input).toString()}</td>
                        <td>
                          {formatEther(event.args.tokens_input).toString()}
                        </td>
                        <td>
                          {formatEther(event.args.liquidity_minted).toString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalItems={totalItems}
            itemsPerPage={PAGE_SIZE}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
};

export default LiquidityProvidedEvents;
