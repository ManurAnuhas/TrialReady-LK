import React from "react";
import logo from "../../../assets/logo.png";

interface BrandMarkProps {
  compact?: boolean;
  tone?: "light" | "dark";
}

export function BrandMark({ compact = false, tone = "dark" }: BrandMarkProps) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {compact ? (
        // Compact mode: show a small square cropped to focus on the circle icon on the left
        <div
          style={{
            width: 40,
            height: 40,
            background: "#ffffff",
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            padding: 2,
          }}
        >
          <img
            src={logo}
            alt="TrialReady LK"
            style={{
              height: "170%",
              width: "170%",
              objectFit: "cover",
              objectPosition: "5% center", // focus on the circular logo badge
            }}
          />
        </div>
      ) : (
        // Full mode: show the full wide horizontal logo in a clean white pill container
        <div
          style={{
            background: "#ffffff",
            borderRadius: 8,
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={logo}
            alt="TrialReady LK Logo"
            style={{
              height: 44,
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      )}
    </div>
  );
}