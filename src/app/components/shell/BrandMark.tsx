import React from "react";

interface BrandMarkProps {
  compact?: boolean;
  tone?: "light" | "dark";
}

export function BrandMark({ compact = false, tone = "dark" }: BrandMarkProps) {
  const isLight = tone === "light";
  const size = compact ? 36 : 40;
  const iconSize = compact ? 30 : 34;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 10 : 12 }}>
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: isLight ? "rgba(255,255,255,0.05)" : "transparent",
          borderRadius: 8,
        }}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="roadGrad" x1="0" y1="200" x2="300" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B3C78" />
              <stop offset="100%" stopColor="#1A609E" />
            </linearGradient>
            <linearGradient id="circleGrad" x1="0" y1="0" x2="400" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#001B5E" />
              <stop offset="100%" stopColor="#0035A0" />
            </linearGradient>
            <linearGradient id="tickGrad" x1="200" y1="100" x2="500" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FE" />
              <stop offset="100%" stopColor="#00B8D4" />
            </linearGradient>
          </defs>

          {/* Upper dark blue crescent border */}
          <path
            d="M 235 20 C 130 20 50 85 20 180 C 40 160 110 130 240 135 C 310 138 335 152 355 172 C 382 120 405 85 470 30 C 410 8 330 0 235 20 Z"
            fill="url(#circleGrad)"
          />

          {/* Lower dark blue outer ring curve */}
          <path
            d="M 148 433 C 190 472 250 490 315 480 C 400 460 450 380 435 285 C 430 250 415 220 395 195 C 412 245 400 305 365 350 C 330 395 270 420 215 410 C 190 405 168 392 148 433 Z"
            fill="#002D88"
          />

          {/* Road swoosh perspective with lane dashes */}
          <path
            d="M 0 350 C 30 270 90 220 180 180 C 270 140 330 180 330 180 C 240 190 150 225 90 280 C 40 325 15 390 0 350 Z"
            fill="url(#roadGrad)"
          />
          <path
            d="M 0 350 C 30 270 90 220 180 180 C 260 144 330 185 330 185 C 250 190 160 230 115 275 C 60 330 20 420 0 350 Z"
            fill="url(#roadGrad)"
          />
          {/* Main blue road perspective body */}
          <path
            d="M 0 350 C 35 260 110 200 205 175 C 320 145 330 185 330 185 C 240 188 150 230 100 290 C 50 350 125 470 125 470 C 80 430 30 390 0 350 Z"
            fill="url(#roadGrad)"
          />

          {/* White dashed road markings */}
          <polygon points="128,260 162,246 142,272 110,286" fill="#FFFFFF" />
          <polygon points="82,310 112,290 92,320 64,338" fill="#FFFFFF" />
          <polygon points="40,366 68,342 50,375 25,398" fill="#FFFFFF" />

          {/* Cyan Checkmark / Tick */}
          <path
            d="M 186 338 L 248 402 L 500 80 L 380 170 L 248 318 L 225 290 Z"
            fill="url(#tickGrad)"
          />
        </svg>
      </div>

      {!compact && (
        <div>
          <div
            style={{
              color: isLight ? "#ffffff" : "#1E293B",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "1.2",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            TrialReady LK
          </div>
          <div
            style={{
              color: isLight ? "#94A3B8" : "#64748B",
              fontSize: 11,
              lineHeight: "1.3",
              marginTop: 1,
              whiteSpace: "nowrap",
            }}
          >
            Metro Drive Academy
          </div>
        </div>
      )}
    </div>
  );
}