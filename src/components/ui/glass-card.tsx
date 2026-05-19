interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "default" | "violet" | "dark";
  tilt?: boolean;
}

export function GlassCard({
  children,
  className = "",
  style,
  variant = "default",
}: GlassCardProps) {
  const bg =
    variant === "violet" ? "rgba(124,58,237,0.08)" :
    variant === "dark"   ? "rgba(6,6,8,0.6)"        :
    "rgba(255,255,255,0.03)";

  const border =
    variant === "violet" ? "1px solid rgba(124,58,237,0.2)" :
    variant === "dark"   ? "1px solid rgba(255,255,255,0.08)" :
    "1px solid rgba(255,255,255,0.08)";

  return (
    <div
      className={`dark-card ${className}`.trim()}
      style={{ background: bg, border, borderRadius: 16, ...style }}
    >
      {children}
    </div>
  );
}
