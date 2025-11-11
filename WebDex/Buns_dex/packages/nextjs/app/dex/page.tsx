"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount, useNetwork } from "@starknet-react/core";
import {
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useScaffoldMultiWriteContract,
} from "~~/hooks/scaffold-stark";
import { IntegerInput } from "~~/components/scaffold-stark/Input/IntegerInput";
import { Balance } from "~~/components/scaffold-stark/Balance";
import SwapDirectionButton from "~~/components/Swap/SwapDirectionButton";
import { useSwapDirection } from "~~/hooks/useSwapDirection";
import { formatUnits, parseUnits } from "ethers";
import { notification } from "~~/utils/scaffold-stark";

const Dex = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { swapDirection, toggleDirection } = useSwapDirection();

  const [strkInput, setStrkInput] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [depositInput, setDepositInput] = useState<string>("");
  const [withdrawInput, setWithdrawInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"swap" | "liquidity">("swap");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [swapType, setSwapType] = useState<"STRK_BNS" | "BNS_STRK" | null>(null);

  // Read contract data
  const { data: strkReserves } = useScaffoldReadContract({
    contractName: "Strk",
    functionName: "balance_of",
    args: [
      "0x072bd4B40cA19F56a2C1BC74aCd989bE1E844e5675f7FF4c5CB73493Ed12a1bF",
    ],
  });

  const { data: tokenReserves } = useScaffoldReadContract({
    contractName: "Buns",
    functionName: "balance_of",
    args: [
      "0x072bd4B40cA19F56a2C1BC74aCd989bE1E844e5675f7FF4c5CB73493Ed12a1bF",
    ],
  });

  const { data: userLiquidity } = useScaffoldReadContract({
    contractName: "Dex",
    functionName: "get_liquidity",
    args: address ? [address] : [undefined],
  });

  const { data: totalLiquidity } = useScaffoldReadContract({
    contractName: "Dex",
    functionName: "get_total_liquidity",
  });

  // Calculate equivalent amounts for swap preview
  const { data: strkToTokenEquivalent } = useScaffoldReadContract({
    contractName: "Dex",
    functionName: "price",
    args:
      strkInput && strkReserves && tokenReserves
        ? [
            parseUnits(strkInput, 18),
            strkReserves as unknown as bigint,
            tokenReserves as unknown as bigint,
          ]
        : [undefined, undefined, undefined],
    watch: true,
  });

  const { data: tokenToStrkEquivalent } = useScaffoldReadContract({
    contractName: "Dex",
    functionName: "price",
    args:
      tokenInput && tokenReserves && strkReserves
        ? [
            parseUnits(tokenInput, 18),
            tokenReserves as unknown as bigint,
            strkReserves as unknown as bigint,
          ]
        : [undefined, undefined, undefined],
    watch: true,
  });

  // Trigger refresh after successful transactions
  useEffect(() => {
    // This effect will run whenever refreshTrigger changes
    // The contract reads will automatically re-fetch when this happens
  }, [refreshTrigger]);

  // Multi-write contract functions for batched transactions
  
  const { sendAsync: strkToTokenSwap } = useScaffoldMultiWriteContract();

  const { sendAsync: tokenToStrkSwap } = useScaffoldMultiWriteContract();

  const { sendAsync: depositLiquidityTx } = useScaffoldMultiWriteContract();

  const { sendAsync: withdrawLiquidityTx } = useScaffoldWriteContract({
    contractName: "Dex",
    functionName: "withdraw",
    args: [undefined],
  });

  const handleStrkToToken = async () => {
    if (!strkInput || parseFloat(strkInput) <= 0) {
      notification.error("Please enter a valid STRK amount");
      return;
    }
    try {
      const parsedAmount = parseUnits(strkInput, 18);
      console.log("Parsed STRK amount for approval:", parsedAmount.toString());
      console.log("Parsed STRK amount for swap:", parsedAmount.toString());

      // Execute batched approval and swap transaction with dynamic args
      notification.info("Approving STRK spending and executing swap...");
      await strkToTokenSwap({
        calls: [
          {
            contractName: "Strk",
            functionName: "approve",
            args: [
              "0x072bd4B40cA19F56a2C1BC74aCd989bE1E844e5675f7FF4c5CB73493Ed12a1bF",
              parsedAmount,
            ],
          },
          {
            contractName: "Dex",
            functionName: "strk_to_token",
            args: [parsedAmount],
          },
        ],
      });

      notification.success("Swap successful!");
      setSwapType("STRK_BNS");
      
      if (swapType) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 3000);
      } else {
        setShowSuccessModal(false);
      }

      setStrkInput("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      notification.error("Swap failed");
      console.error(error);
    }
  };

  const handleTokenToStrk = async () => {
    if (!tokenInput || parseFloat(tokenInput) <= 0) {
      notification.error("Please enter a valid token amount");
      return;
    }
    try {
      const parsedAmount = parseUnits(tokenInput, 18);
      console.log("Parsed BNS amount for approval:", parsedAmount.toString());
      console.log("Parsed BNS amount for swap:", parsedAmount.toString());

      // Execute batched approval and swap transaction
      notification.info("Approving BNS spending and executing swap...");
      await tokenToStrkSwap({
        calls: [
          {
            contractName: "Buns",
            functionName: "approve",
            args: [
              "0x072bd4B40cA19F56a2C1BC74aCd989bE1E844e5675f7FF4c5CB73493Ed12a1bF",
              parsedAmount,
            ],
          },
          {
            contractName: "Dex",
            functionName: "token_to_strk",
            args: [parsedAmount],
          },
        ],
      });

      // notification.success("Swap successful!");

      // Instead of toast
      setSwapType("BNS_STRK");

      if (swapType) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 3000);
      }else {
        setShowSuccessModal(false);
      }

      setTokenInput("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      notification.error("Swap failed");
      console.error(error);
    }
  };

  const handleDeposit = async () => {
    if (!depositInput || parseFloat(depositInput) <= 0) {
      notification.error("Please enter a valid STRK amount");
      return;
    }
    try {
      const parsedAmount = parseUnits(depositInput, 18);
      console.log(
        "Parsed STRK amount for deposit approval:",
        parsedAmount.toString()
      );
      console.log("Parsed STRK amount for deposit:", parsedAmount.toString());

      // For simplicity, assume 1:1 ratio initially and let the contract handle the calculation
      // In a real DEX, you'd want to calculate this properly
      const estimatedTokenAmount = parsedAmount; // Estimate based on current reserves

      // Execute batched approvals and deposit transaction
      notification.info(
        "Approving STRK and BNS spending and adding liquidity..."
      );
      await depositLiquidityTx({
        calls: [
          {
            contractName: "Strk",
            functionName: "approve",
            args: [
              "0x072bd4B40cA19F56a2C1BC74aCd989bE1E844e5675f7FF4c5CB73493Ed12a1bF",
              // parsedAmount * parsedAmount , // Approve double the amount for safety
              1000000000000000000000000000, //harcode 1 billion
              1000000000000000000000000000, //harcode 1 billion
            ],
          },
          {
            contractName: "Buns",
            functionName: "approve",
            args: [
              "0x072bd4B40cA19F56a2C1BC74aCd989bE1E844e5675f7FF4c5CB73493Ed12a1bF",
              // estimatedTokenAmount * estimatedTokenAmount, // Approve double the amount for safety
              1000000000000000000000000000, //harcode 1 billion
              1000000000000000000000000000, //harcode 1 billion
            ],
          },
          {
            contractName: "Dex",
            functionName: "deposit",
            args: [parsedAmount],
          },
        ],
      });
      notification.success("Liquidity deposited successfully!");
      setDepositInput("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      notification.error("Deposit failed");
      console.error(error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawInput || parseFloat(withdrawInput) <= 0) {
      notification.error("Please enter a valid liquidity amount");
      return;
    }
    try {
      const parsedAmount = parseUnits(withdrawInput, 18);
      console.log(
        "Parsed liquidity amount for withdrawal:",
        parsedAmount.toString()
      );

      // Execute the withdrawal (no approval needed for withdrawal)
      await withdrawLiquidityTx({
        args: [parsedAmount],
      });
      notification.success("Liquidity withdrawn successfully!");
      setWithdrawInput("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      notification.error("Withdrawal failed");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="container flex flex-col items-center gap-8 px-4 lg:px-8 w-full max-w-7xl">
            <div className="flex w-full max-w-lg flex-col items-center">
              <div className="flex flex-col items-center justify-center gap-1 text-center">
                <span className="text-2xl font-bold">
                  BunSwap: Your Gateway to DeFi on Starknet
                </span>

                <span className="text-sm text-muted-foreground">
                  The Decentralized Exchange on Starknet
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 w-full">
              <div className="flex flex-wrap items-center justify-center gap-4 w-full mx-auto text-sm">
                <div className="stat p-4 sm:p-6 w-fit">
                  <div className="stat-title">STRK Reserves</div>
                  <div className="stat-value">
                    {strkReserves
                      ? parseFloat(
                          formatUnits(strkReserves as unknown as bigint, 18)
                        ).toFixed(3)
                      : "0.000"}
                  </div>
                </div>

                <div className="stat p-4 sm:p-6 w-fit">
                  <div className="stat-title">BNS Reserves</div>
                  <div className="stat-value">
                    {tokenReserves
                      ? parseFloat(
                          formatUnits(tokenReserves as unknown as bigint, 18)
                        ).toFixed(3)
                      : "0.000"}
                  </div>
                </div>

                <div className="stat p-4 sm:p-6 w-fit">
                  <div className="stat-title">Total Liquidity</div>
                  <div className="stat-value">
                    {totalLiquidity
                      ? parseFloat(
                          formatUnits(totalLiquidity as unknown as bigint, 18)
                        ).toFixed(3)
                      : "0.000"}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card text-card-foreground flex w-full max-w-6xl flex-1 flex-col items-center justify-between gap-20 p-6">
              <div className="flex size-full flex-col gap-2">
                <div className="tabs tabs-boxed justify-center mb-6">
                  <a

            <div className="rounded-xl bg-card text-card-foreground flex flex-1 flex-col items-center justify-between gap-8 w-full">
              <div className="flex size-full flex-col gap-2 lg:text-lg">
                <div className="tabs tabs-boxed justify-center">
                  <button

                    className={`tab ${activeTab === "swap" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("swap")}
                  >
                    Swap
                  </button>
                  <button
                    className={`tab ${activeTab === "liquidity" ? "tab-active" : ""}`}
                    onClick={() => setActiveTab("liquidity")}
                  >
                    Liquidity
                  </button>
                </div>
                {activeTab === "swap" && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-6 relative">
                      <motion.div
                        className="card bg-base-100 shadow-xl w-full max-w-md"
                        animate={{
                          y: swapDirection === "STRK_BNS" ? 0 : 0,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <div className="card-body">
                          <h2 className="card-title text-center">
                            {swapDirection === "STRK_BNS" ? "STRK" : "BNS"}
                          </h2>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-sm font-medium">
                                {swapDirection === "STRK_BNS" ? "STRK" : "BNS"}{" "}
                                Amount
                              </span>
                              <span className="label-text">
                                {swapDirection === "STRK_BNS" ? "STRK" : "BNS"}{" "}
                                Amount
                              </span>
                            </label>
                            <IntegerInput
                              value={
                                swapDirection === "STRK_BNS"
                                  ? strkInput
                                  : tokenInput
                              }
                              onChange={(value) => {
                                if (swapDirection === "STRK_BNS") {
                                  setStrkInput(value.toString());
                                } else {
                                  setTokenInput(value.toString());
                                }
                              }}
                              placeholder={`Enter ${swapDirection === "STRK_BNS" ? "STRK" : "BNS"} amount`}
                              disableMultiplyBy1e18
                            />
                        </div>
                      </motion.div>

                      <SwapDirectionButton
                        swapDirection={swapDirection}
                        onToggle={toggleDirection}
                      />

                      <motion.div
                        className="card bg-base-100 shadow-xl w-full max-w-md"
                        animate={{
                          y: swapDirection === "STRK_BNS" ? 0 : 0,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <div className="card-body">
                          <h2 className="card-title text-center">
                            {swapDirection === "STRK_BNS" ? "BNS" : "STRK"}
                          </h2>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-sm font-medium">
                                {swapDirection === "STRK_BNS" ? "BNS" : "STRK"}{" "}
                                Amount
                              </span>
                            </label>
                            <IntegerInput
                              value={
                                swapDirection === "STRK_BNS"
                                  ? strkToTokenEquivalent
                                    ? parseFloat(
                                        formatUnits(
                                          strkToTokenEquivalent as unknown as bigint,
                                          18
                                        )
                                      ).toFixed(6)
                                    : ""
                                  : tokenToStrkEquivalent
                                    ? parseFloat(
                                        formatUnits(
                                          tokenToStrkEquivalent as unknown as bigint,
                                          18
                                        )
                                      ).toFixed(6)
                                    : ""
                              }
                              onChange={() => {}} // Read-only
                              placeholder={`You will receive ${swapDirection === "STRK_BNS" ? "BNS" : "STRK"}`}
                              disableMultiplyBy1e18
                              disabled
                            />
                          </div>
                          <div className="card-actions justify-center">
                            <button
                              className="btn btn-primary"
                              onClick={handleStrkToToken}
                              disabled={!address || !strkInput}
                            >
                              Swap STRK for BNS
                            </button>

                            {swapDirection === "STRK_BNS" &&
                              strkToTokenEquivalent && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  ≈{" "}
                                  {parseFloat(
                                    formatUnits(
                                      strkToTokenEquivalent as unknown as bigint,
                                      18
                                    )
                                  ).toFixed(6)}{" "}
                                  BNS
                                </div>
                              )}
                            {swapDirection === "BNS_STRK" &&
                              tokenToStrkEquivalent && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  ≈{" "}
                                  {parseFloat(
                                    formatUnits(
                                      tokenToStrkEquivalent as unknown as bigint,
                                      18
                                    )
                                  ).toFixed(6)}{" "}
                                  STRK
                                </div>
                              )}

                          </div>
                        </div>
                      </motion.div>

                      <SwapDirectionButton
                        swapDirection={swapDirection}
                        onToggle={toggleDirection}
                      />

                      <motion.div
                        className="card bg-base-100 shadow-xl w-full max-w-md"
                        animate={{
                          y: swapDirection === "STRK_BNS" ? 0 : 0,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <div className="card-body">
                          <h2 className="card-title text-center">
                            {swapDirection === "STRK_BNS" ? "BNS" : "STRK"}
                          </h2>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">
                                {swapDirection === "STRK_BNS" ? "BNS" : "STRK"}{" "}
                                Amount
                              </span>
                            </label>
                            <IntegerInput
                              value={
                                swapDirection === "STRK_BNS"
                                  ? strkToTokenEquivalent
                                    ? parseFloat(
                                        formatUnits(
                                          strkToTokenEquivalent as unknown as bigint,
                                          18
                                        )
                                      ).toFixed(6)
                                    : ""
                                  : tokenToStrkEquivalent
                                    ? parseFloat(
                                        formatUnits(
                                          tokenToStrkEquivalent as unknown as bigint,
                                          18
                                        )
                                      ).toFixed(6)
                                    : ""
                              }
                              onChange={() => {}} // Read-only
                              placeholder={`You will receive ${swapDirection === "STRK_BNS" ? "BNS" : "STRK"}`}
                              disableMultiplyBy1e18
                              disabled
                            />
                          </div>
                          <div className="card-actions justify-center">
                            <button
                              className="btn btn-primary"
                              onClick={
                                swapDirection === "STRK_BNS"
                                  ? handleStrkToToken
                                  : handleTokenToStrk
                              }
                              disabled={
                                !address ||
                                !(swapDirection === "STRK_BNS"
                                  ? strkInput
                                  : tokenInput)
                              }
                            >
                              Swap{" "}
                              {swapDirection === "STRK_BNS"
                                ? "STRK for BNS"
                                : "BNS for STRK"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
                {activeTab === "liquidity" && (
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title">Add Liquidity</h2>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-sm font-medium">
                                STRK Amount
                              </span>
                            </label>
                            <IntegerInput
                              value={depositInput}
                              onChange={(value) =>
                                setDepositInput(value.toString())
                              }
                              placeholder="Enter STRK amount"
                              disableMultiplyBy1e18
                            />
                          </div>
                          <div className="card-actions justify-end">
                            <button
                              className="btn btn-primary"
                              onClick={handleDeposit}
                              disabled={!address || !depositInput}
                            >
                              Add Liquidity
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                          <h2 className="card-title">Remove Liquidity</h2>
                          <div className="form-control grid gap-2">
                            <label className="label">
                              <span className="label-text text-sm font-medium">
                                Liquidity Amount
                              </span>
                            </label>
                            <IntegerInput
                              value={withdrawInput}
                              onChange={(value) =>
                                setWithdrawInput(value.toString())
                              }
                              placeholder="Enter liquidity amount"
                              disableMultiplyBy1e18
                            />
                          </div>
                          <div className="card-actions justify-end">
                            <button
                              className="btn btn-primary"
                              onClick={handleWithdraw}
                              disabled={!address || !withdrawInput}
                            >
                              Remove Liquidity
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                      <div className="card-body">
                        <h2 className="card-title">Your Liquidity</h2>
                        <p className="text-lg font-bold">
                          {userLiquidity
                            ? parseFloat(
                                formatUnits(
                                  userLiquidity as unknown as bigint,
                                  18
                                )
                              ).toFixed(3)
                            : "0"}{" "}
                          <span className="font-normal">LP Tokens</span>
                        </p>
                        {address && (
                          <div className="mt-4">
                            <span className="card-title">
                              Your STRK Balance:{" "}
                              <Balance
                                address={address}
                                className="text-[1rem]"
                              />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm font-normal text-muted-foreground">
                Disclaimer: This DEX is for educational purposes. Trading
                involves risk and you may lose your funds. Always do your own
                research before interacting with smart contracts.
              </p>
            </div>

          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 text-center rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl lg:text-5xl">
                  {swapType === "STRK_BNS" ? "🎉" : "💫"}
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                  {swapType === "STRK_BNS"
                    ? "STRK → BNS Swap Successful!"
                    : "BNS → STRK Swap Successful!"}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 font-semibold">
                  {swapType === "STRK_BNS"
                    ? "Your STRK was successfully swapped for BNS."
                    : "Your BNS was successfully swapped for STRK."}
                </p>

                <button
                  className="btn bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold hover:bg-gradient-nav transition-all"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dex;
