"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { SwapDirection } from "~~/hooks/useSwapDirection";

interface SwapDirectionButtonProps {
  swapDirection: SwapDirection;
  onToggle: () => void;
}

const SwapDirectionButton: React.FC<SwapDirectionButtonProps> = ({
  swapDirection,
  onToggle,
}) => {
  return (
    <motion.button
      className="btn btn-circle btn-primary btn-outline mx-auto relative overflow-hidden"
      onClick={onToggle}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotate: swapDirection === "STRK_BNS" ? 0 : 180,
        boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
        boxShadow: { duration: 0.3 },
      }}
      onAnimationComplete={() => {
        // This callback can be used to trigger value swapping after rotation
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <ArrowUpDown className="w-5 h-5 relative z-10 text-base-content" />
    </motion.button>
  );
};

export default SwapDirectionButton;
