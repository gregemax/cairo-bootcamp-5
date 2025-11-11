"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

interface CoinProps {
  id: number;
  size: number;
  opacity: number;
  gradient: string;
  x: number;
  y: number;
}

const FloatingCoinsBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random coins
  const coins: CoinProps[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40, // 40-100px
    opacity: Math.random() * 0.4 + 0.4, // 0.4-0.8
    gradient: [
      "radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0.2) 70%)", // red
      "radial-gradient(circle, rgba(0,0,255,0.8) 0%, rgba(0,0,255,0.2) 70%)", // blue
      "radial-gradient(circle, rgba(0,255,0,0.8) 0%, rgba(0,255,0,0.2) 70%)", // green
      "radial-gradient(circle, rgba(255,165,0,0.8) 0%, rgba(255,165,0,0.2) 70%)", // orange
      "radial-gradient(circle, rgba(255,255,0,0.8) 0%, rgba(255,255,0,0.2) 70%)", // yellow
      "radial-gradient(circle, rgba(128,0,128,0.8) 0%, rgba(128,0,128,0.2) 70%)", // purple
      "radial-gradient(circle, rgba(255,105,180,0.8) 0%, rgba(255,105,180,0.2) 70%)", // pink
      "radial-gradient(circle, rgba(135,206,235,0.8) 0%, rgba(135,206,235,0.2) 70%)", // sky blue
    ][Math.floor(Math.random() * 8)],
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    coins.forEach((coin, index) => {
      const element = containerRef.current?.children[index] as HTMLElement;
      if (!element) return;

      // Random floating animation
      tl.to(
        element,
        {
          x: `+=${Math.random() * 100 - 50}`,
          y: `+=${Math.random() * 100 - 50}`,
          rotation: Math.random() * 360,
          duration: Math.random() * 10 + 10, // 10-20 seconds
          ease: "power1.inOut",
        },
        index * 0.5
      );
    });

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth - 0.5) * 20;
      const yPercent = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(containerRef.current, {
        x: xPercent,
        y: yPercent,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      tl.kill();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [coins]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        willChange: "transform, opacity",
        background:
          "radial-gradient(circle at 50% 50%, rgba(10,10,30,0.5) 0%, transparent 80%)",
        mixBlendMode: "screen",
      }}
    >
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute rounded-full blur-sm"
          style={{
            width: coin.size,
            height: coin.size,
            background: coin.gradient,
            opacity: coin.opacity,
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            willChange: "transform, opacity",
          }}
          whileHover={{
            scale: 1.5,
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.3 },
          }}
          animate={{
            opacity: coin.opacity,
          }}
          transition={{
            opacity: { duration: 0.3 },
          }}
          onHoverStart={() => {
            // Ripple effect
            const element = containerRef.current?.children[
              coin.id
            ] as HTMLElement;
            if (element) {
              gsap.to(element, {
                scale: 1.3,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
              });
            }
          }}
        >
          {/* Ripple waves */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{
              scale: [0, 2, 3],
              opacity: [0, 0.5, 0],
              transition: {
                duration: 1.5,
                times: [0, 0.5, 1],
                ease: "easeOut",
              },
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/20"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{
              scale: [0, 1.5, 2.5],
              opacity: [0, 0.3, 0],
              transition: {
                duration: 1.5,
                delay: 0.2,
                times: [0, 0.5, 1],
                ease: "easeOut",
              },
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/10"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{
              scale: [0, 1, 2],
              opacity: [0, 0.2, 0],
              transition: {
                duration: 1.5,
                delay: 0.4,
                times: [0, 0.5, 1],
                ease: "easeOut",
              },
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FloatingCoinsBackground;
