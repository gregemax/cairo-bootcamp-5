import { useState } from "react";

export type SwapDirection = "STRK_BNS" | "BNS_STRK";

export const useSwapDirection = () => {
  const [swapDirection, setSwapDirection] = useState<SwapDirection>("STRK_BNS");

  const toggleDirection = () => {
    setSwapDirection((prev) => (prev === "STRK_BNS" ? "BNS_STRK" : "STRK_BNS"));
  };

  return {
    swapDirection,
    toggleDirection,
  };
};
