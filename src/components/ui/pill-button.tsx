"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface PillButtonProps {
  variant?: "primary" | "secondary" | "navbar";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const styles = {
  primary: {
    base: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 9999,
      background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
      padding: "14px 32px",
      fontWeight: 600,
      fontSize: 16,
      color: "#fff",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
      outline: "none",
      whiteSpace: "nowrap" as const,
      transition: "box-shadow 0.3s ease, filter 0.3s ease",
    },
    hover: { scale: 1.05 } as const,
    tap: { scale: 0.97 } as const,
  },
  secondary: {
    base: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 9999,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.15)",
      padding: "14px 32px",
      fontWeight: 500,
      fontSize: 16,
      color: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      cursor: "pointer",
      outline: "none",
      whiteSpace: "nowrap" as const,
      transition: "background 0.2s ease, border-color 0.2s ease",
    },
    hover: { scale: 1.03 } as const,
    tap: { scale: 0.97 } as const,
  },
  navbar: {
    base: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 9999,
      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
      padding: "10px 24px",
      fontWeight: 600,
      fontSize: 14,
      color: "#fff",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 0 16px rgba(124, 58, 237, 0.35)",
      outline: "none",
      whiteSpace: "nowrap" as const,
      transition: "box-shadow 0.2s ease",
    },
    hover: { scale: 1.03, opacity: 0.92 } as const,
    tap: { scale: 0.97 } as const,
  },
} as const;

export function PillButton({
  variant = "primary",
  children,
  onClick,
  type = "button",
  disabled,
  style,
  className,
}: PillButtonProps) {
  const s = styles[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : s.hover}
      whileTap={disabled ? undefined : s.tap}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{ ...s.base, ...(disabled ? { opacity: 0.45, cursor: "not-allowed" } : {}), ...style }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
