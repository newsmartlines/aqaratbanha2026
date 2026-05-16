interface SlimToggleProps {
  on: boolean;
  onToggle?: () => void;
  color?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function SlimToggle({
  on,
  onToggle,
  color = "#2563EB",
  size = "md",
  disabled,
}: SlimToggleProps) {
  const cfg = {
    sm: { w: 30, h: 17, dot: 11 },
    md: { w: 38, h: 21, dot: 15 },
    lg: { w: 46, h: 25, dot: 19 },
  }[size];

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      style={{
        width: cfg.w,
        height: cfg.h,
        borderRadius: cfg.h / 2,
        backgroundColor: on ? color : "#CBD5E1",
        border: "none",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        position: "relative",
        flexShrink: 0,
        transition: "background-color 180ms ease",
        padding: 0,
        outline: "none",
      }}>
      <span
        style={{
          display: "block",
          width: cfg.dot,
          height: cfg.dot,
          borderRadius: "50%",
          backgroundColor: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.22)",
          position: "absolute",
          top: (cfg.h - cfg.dot) / 2,
          left: on ? cfg.w - cfg.dot - 3 : 3,
          transition: "left 180ms ease",
        }}
      />
    </button>
  );
}
