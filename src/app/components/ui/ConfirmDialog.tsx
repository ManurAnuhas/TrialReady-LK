import React from "react";
import { AlertTriangle, X, Trash2, UserX, XCircle } from "lucide-react";

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CFG: Record<ConfirmVariant, { icon: React.ReactNode; color: string; bg: string; btnBg: string; btnHover: string }> = {
  danger: {
    icon: <Trash2 size={22} />,
    color: "#DC2626",
    bg: "#FEE2E2",
    btnBg: "#DC2626",
    btnHover: "#B91C1C",
  },
  warning: {
    icon: <AlertTriangle size={22} />,
    color: "#D97706",
    bg: "#FEF3C7",
    btnBg: "#D97706",
    btnHover: "#B45309",
  },
  info: {
    icon: <XCircle size={22} />,
    color: "#2563EB",
    bg: "#EFF6FF",
    btnBg: "#2563EB",
    btnHover: "#1D4ED8",
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const cfg = VARIANT_CFG[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.45)",
          zIndex: 200,
          backdropFilter: "blur(2px)",
        }}
      />
      {/* Dialog */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          zIndex: 201,
          width: 440,
          padding: "28px 28px 24px",
          fontFamily: "'Inter',-apple-system,sans-serif",
          animation: "dialogIn 0.18s ease",
        }}
      >
        <style>{`@keyframes dialogIn { from { opacity:0; transform:translate(-50%,-48%); } to { opacity:1; transform:translate(-50%,-50%); } }`}</style>

        {/* Close */}
        <button
          onClick={onCancel}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 7,
            border: "1px solid #E2E8F0",
            background: "#ffffff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#64748B",
          }}
        >
          <X size={14} />
        </button>

        {/* Icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: cfg.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: cfg.color,
            marginBottom: 16,
          }}
        >
          {cfg.icon}
        </div>

        {/* Content */}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: "0 0 8px" }}>{title}</h2>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, margin: "0 0 24px" }}>{description}</p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 8,
              border: "1.5px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 8,
              border: "none",
              background: cfg.btnBg,
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = cfg.btnHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = cfg.btnBg; }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
