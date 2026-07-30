import React, { useState, useRef, useEffect } from "react";
import {
  Search, Download, Plus, X, Printer, ChevronDown,
  TrendingUp, Wallet, AlertCircle, Clock, CheckCircle2,
  MoreHorizontal, Eye, Receipt, FileText,
} from "lucide-react";

/* â”€â”€â”€ Types â”€â”€â”€ */

interface Payment {
  id: string;
  receipt: string;
  student: string;
  studentId: string;
  package: string;
  amount: number;
  method: "Cash" | "Card" | "Bank Transfer";
  date: string;
  recordedBy: string;
  status: "Completed" | "Pending" | "Overdue" | "Refunded";
}

/* â”€â”€â”€ Sample data â”€â”€â”€ */

const PAYMENTS: Payment[] = [
  { id: "p1", receipt: "RCPT-2026-0841", student: "Loshan Mihisara", studentId: "STD-2026-0048", package: "Standard LV Package", amount: 10000, method: "Bank Transfer", date: "2026-07-20", recordedBy: "Manura Anuhas", status: "Completed" },
  { id: "p2", receipt: "RCPT-2026-0840", student: "Ravishka Rathnayake", studentId: "STD-2026-0052", package: "Premium LV Package", amount: 20000, method: "Card", date: "2026-07-19", recordedBy: "Manura Anuhas", status: "Completed" },
  { id: "p3", receipt: "RCPT-2026-0839", student: "Lasindu Dilshan", studentId: "STD-2026-0061", package: "Motorcycle Starter", amount: 14000, method: "Cash", date: "2026-07-18", recordedBy: "Admin", status: "Completed" },
  { id: "p4", receipt: "RCPT-2026-0838", student: "Nethmi Wijesinghe", studentId: "STD-2026-0068", package: "Standard LV Package", amount: 22500, method: "Bank Transfer", date: "2026-07-17", recordedBy: "Manura Anuhas", status: "Completed" },
  { id: "p5", receipt: "RCPT-2026-0837", student: "Dilhara Senanayake", studentId: "STD-2026-0072", package: "Premium LV Package", amount: 15000, method: "Cash", date: "2026-07-16", recordedBy: "Admin", status: "Pending" },
  { id: "p6", receipt: "RCPT-2026-0836", student: "Ruwan Wickramasinghe", studentId: "STD-2026-0044", package: "Heavy Vehicle Package", amount: 25000, method: "Bank Transfer", date: "2026-07-15", recordedBy: "Manura Anuhas", status: "Overdue" },
  { id: "p7", receipt: "RCPT-2026-0835", student: "Amaya Silva", studentId: "STD-2026-0039", package: "Standard LV Package", amount: 10000, method: "Card", date: "2026-07-14", recordedBy: "Admin", status: "Completed" },
  { id: "p8", receipt: "RCPT-2026-0834", student: "Chamara Perera", studentId: "STD-2026-0036", package: "Motorcycle Starter", amount: 28000, method: "Cash", date: "2026-07-12", recordedBy: "Manura Anuhas", status: "Refunded" },
];

const PACKAGE_OPTIONS = ["All packages", "Standard LV Package", "Premium LV Package", "Motorcycle Starter", "Heavy Vehicle Package", "Three-Wheeler Package"];
const STATUS_OPTIONS = ["All statuses", "Completed", "Pending", "Overdue", "Refunded"];
const METHOD_OPTIONS = ["All methods", "Cash", "Card", "Bank Transfer"];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  Completed: { color: "#166534", bg: "#DCFCE7" },
  Pending: { color: "#92400E", bg: "#FEF3C7" },
  Overdue: { color: "#991B1B", bg: "#FEE2E2" },
  Refunded: { color: "#4B5563", bg: "#F3F4F6" },
};

/* â”€â”€â”€ Record Payment Modal â”€â”€â”€ */

interface RecordPaymentProps { onClose: () => void; onSave: (print: boolean) => void; }

function RecordPaymentModal({ onClose, onSave }: RecordPaymentProps) {
  const AGREED_PRICE = 45000;
  const PREV_PAID = 22500;

  const [form, setForm] = useState({
    student: "Loshan Mihisara",
    studentId: "STD-2026-0048",
    package: "Standard LV Package",
    paymentAmount: 10000,
    discount: 0,
    additionalCharge: 0,
    method: "Bank Transfer" as "Cash" | "Card" | "Bank Transfer",
    notes: "",
  });

  const balance = AGREED_PRICE - PREV_PAID - form.paymentAmount - form.discount + form.additionalCharge;

  const inputStyle: React.CSSProperties = { width: "100%", height: 40, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const readonlyStyle: React.CSSProperties = { ...inputStyle, background: "#F8FAFC", color: "#64748B" };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none", WebkitAppearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: 14, paddingRight: 32, cursor: "pointer" };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, display: "block" };
  const numInput = (val: number, key: "paymentAmount" | "discount" | "additionalCharge") => (
    <input type="number" style={inputStyle} value={val || ""} onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) || 0 })} placeholder="0" />
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 99 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#ffffff", borderRadius: 16, boxShadow: "0 24px 80px rgba(0,0,0,0.18)", zIndex: 100, width: 620, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>Record payment</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Enter payment details and confirm the transaction</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}><X size={14} /></button>
        </div>

        <div style={{ overflowY: "auto", display: "flex", gap: 0 }}>
          {/* Left form */}
          <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Student */}
            <div>
              <label style={labelStyle}>Student</label>
              <select style={selectStyle} value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
                <option>Loshan Mihisara</option>
                <option>Ravishka Rathnayake</option>
                <option>Lasindu Dilshan</option>
                <option>Nethmi Wijesinghe</option>
                <option>Dilhara Senanayake</option>
              </select>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{form.studentId}</div>
            </div>

            {/* Package */}
            <div>
              <label style={labelStyle}>Package</label>
              <select style={selectStyle} value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })}>
                <option>Standard LV Package</option>
                <option>Premium LV Package</option>
                <option>Motorcycle Starter</option>
                <option>Heavy Vehicle Package</option>
              </select>
            </div>

            {/* Read-only financials */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Agreed package price</label>
                <div style={{ ...readonlyStyle, display: "flex", alignItems: "center", fontSize: 13, color: "#64748B" }}>LKR {AGREED_PRICE.toLocaleString()}</div>
              </div>
              <div>
                <label style={labelStyle}>Previously paid</label>
                <div style={{ ...readonlyStyle, display: "flex", alignItems: "center", fontSize: 13, color: "#64748B" }}>LKR {PREV_PAID.toLocaleString()}</div>
              </div>
            </div>

            {/* Editable payment fields */}
            <div>
              <label style={labelStyle}>Payment amount (LKR) <span style={{ color: "#DC2626" }}>*</span></label>
              {numInput(form.paymentAmount, "paymentAmount")}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={labelStyle}>Discount (LKR)</label>
                {numInput(form.discount, "discount")}
              </div>
              <div>
                <label style={labelStyle}>Additional charge (LKR)</label>
                {numInput(form.additionalCharge, "additionalCharge")}
              </div>
            </div>

            {/* Payment method â€” no online gateway */}
            <div>
              <label style={labelStyle}>Payment method <span style={{ color: "#DC2626" }}>*</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {(["Cash", "Card", "Bank Transfer"] as const).map((m) => (
                  <button key={m} onClick={() => setForm({ ...form, method: m })}
                    style={{ height: 40, borderRadius: 8, border: `1.5px solid ${form.method === m ? "#2563EB" : "#E2E8F0"}`, background: form.method === m ? "#EFF6FF" : "#ffffff", color: form.method === m ? "#2563EB" : "#64748B", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Receipt number (auto) */}
            <div>
              <label style={labelStyle}>Receipt number (auto-generated)</label>
              <div style={{ ...readonlyStyle, display: "flex", alignItems: "center", fontSize: 13, color: "#94A3B8", fontFamily: "monospace" }}>RCPT-2026-0842</div>
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea
                style={{ width: "100%", height: 64, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#1E293B", background: "#ffffff", outline: "none", fontFamily: "inherit", resize: "none", boxSizing: "border-box" }}
                placeholder="Any additional notes about this payment..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Right â€” live calc panel */}
          <div style={{ width: 200, background: "#F8FAFC", borderLeft: "1px solid #E2E8F0", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 0, flexShrink: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>Balance calculation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { label: "Package price", value: AGREED_PRICE, color: "#1E293B", sign: "" },
                { label: "Additional charges", value: form.additionalCharge, color: form.additionalCharge > 0 ? "#C2410C" : "#94A3B8", sign: "+" },
                { label: "Discounts", value: form.discount, color: form.discount > 0 ? "#16A34A" : "#94A3B8", sign: "âˆ’" },
                { label: "Previous payments", value: PREV_PAID, color: "#16A34A", sign: "âˆ’" },
                { label: "This payment", value: form.paymentAmount, color: "#2563EB", sign: "âˆ’" },
              ].map(({ label, value, color, sign }) => (
                <div key={label} style={{ padding: "9px 0", borderBottom: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 2 }}>{sign ? `${sign} ${label}` : label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color }}>{value > 0 ? `LKR ${value.toLocaleString()}` : "â€”"}</div>
                </div>
              ))}
            </div>

            {/* Result */}
            <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 10, background: balance < 0 ? "#FEE2E2" : balance === 0 ? "#DCFCE7" : "#EFF6FF", border: `1px solid ${balance < 0 ? "#FCA5A5" : balance === 0 ? "#86EFAC" : "#BFDBFE"}` }}>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>Remaining balance</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: balance < 0 ? "#DC2626" : balance === 0 ? "#16A34A" : "#1D4ED8", letterSpacing: "-0.02em" }}>LKR {Math.abs(balance).toLocaleString()}</div>
              {balance < 0 && <div style={{ fontSize: 10, color: "#DC2626", marginTop: 4 }}>Overpayment â€” issue refund</div>}
              {balance === 0 && <div style={{ fontSize: 10, color: "#16A34A", marginTop: 4 }}>Fully settled âœ“</div>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", background: "#F8FAFC", display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={() => onSave(false)} style={{ height: 40, padding: "0 18px", borderRadius: 8, border: "1.5px solid #2563EB", background: "#EFF6FF", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Save payment</button>
          <button onClick={() => onSave(true)} style={{ display: "flex", alignItems: "center", gap: 6, height: 40, padding: "0 18px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Printer size={13} />Save and print receipt
          </button>
        </div>
      </div>
    </>
  );
}

/* â”€â”€â”€ Printable Receipt â”€â”€â”€ */

interface ReceiptProps { onClose: () => void; }

function PrintableReceiptModal({ onClose }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const doPrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          body > * { display: none !important; }
          .printable-receipt-overlay { display: block !important; }
          .printable-receipt-overlay > .receipt-modal { box-shadow: none !important; border: none !important; width: 100% !important; border-radius: 0 !important; position: static !important; transform: none !important; }
          .no-print { display: none !important; }
          .receipt-card { box-shadow: none !important; border: 1px solid #E2E8F0 !important; }
        }
      `}</style>
      <div className="printable-receipt-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="receipt-modal" onClick={(e) => e.stopPropagation()}
          style={{ background: "#F8FAFC", borderRadius: 16, boxShadow: "0 24px 80px rgba(0,0,0,0.2)", width: 480, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>

          {/* Toolbar */}
          <div className="no-print" style={{ padding: "12px 18px", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>Payment Receipt Preview</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={doPrint}
                style={{ display: "flex", alignItems: "center", gap: 5, height: 34, padding: "0 14px", borderRadius: 7, border: "1.5px solid #475569", background: "transparent", color: "#CBD5E1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <Printer size={12} />Print
              </button>
              <button
                style={{ display: "flex", alignItems: "center", gap: 5, height: 34, padding: "0 14px", borderRadius: 7, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <Download size={12} />Download PDF
              </button>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #475569", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}><X size={14} /></button>
            </div>
          </div>

          {/* Receipt card */}
          <div style={{ overflowY: "auto", padding: 24 }}>
            <div ref={receiptRef} className="receipt-card"
              style={{ background: "#ffffff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden" }}>

              {/* Header band */}
              <div style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)", padding: "28px 28px 22px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.01em", marginBottom: 2 }}>Metro Drive Academy</div>
                <div style={{ fontSize: 11, color: "#93C5FD", marginBottom: 12 }}>No. 45, Galle Road, Colombo 03 Â· Tel: 011-258-4400 Â· www.metrodriveacademy.lk</div>
                <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: 5, background: "rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 700, color: "#ffffff", letterSpacing: "0.08em", textTransform: "uppercase" }}>Official Payment Receipt</div>
              </div>

              {/* Receipt number + date strip */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 28px", background: "#F8FAFC", borderBottom: "2px dashed #E2E8F0" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Receipt number</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", fontFamily: "monospace" }}>RCPT-2026-0842</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Date issued</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>22 July 2026</div>
                </div>
              </div>

              {/* Student & payment info */}
              <div style={{ padding: "20px 28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
                  {[
                    ["Student name", "Loshan Mihisara"],
                    ["Student ID", "STD-2026-0048"],
                    ["Training package", "Standard LV Package"],
                    ["Vehicle category", "Light Vehicle"],
                    ["Payment method", "Bank Transfer"],
                    ["Recorded by", "Manura Anuhas"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Amount section */}
                <div style={{ marginTop: 20, background: "#F8FAFC", borderRadius: 10, padding: "14px 18px" }}>
                  {[
                    { label: "Package price", value: "LKR 45,000", muted: false },
                    { label: "Previously paid", value: "âˆ’ LKR 22,500", muted: true },
                    { label: "Discount", value: "âˆ’ LKR 0", muted: true },
                    { label: "Additional charges", value: "+ LKR 0", muted: true },
                  ].map(({ label, value, muted }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: 13, color: muted ? "#94A3B8" : "#475569" }}>{label}</span>
                      <span style={{ fontSize: 13, color: muted ? "#94A3B8" : "#475569", fontWeight: muted ? 400 : 600 }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Payment received</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#16A34A", letterSpacing: "-0.02em" }}>LKR 10,000</span>
                  </div>
                </div>

                {/* Remaining */}
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>Remaining balance after this payment</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#1D4ED8" }}>LKR 12,500</span>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "14px 28px 20px", borderTop: "2px dashed #E2E8F0", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6 }}>
                  This is an official receipt issued by Metro Drive Academy.<br />
                  Please retain this document for your records. For queries, contact <span style={{ color: "#2563EB" }}>finance@metrodriveacademy.lk</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 10, color: "#94A3B8" }}>Generated by TrialReady LK Â· 22 Jul 2026 14:30</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* â”€â”€â”€ Action menu â”€â”€â”€ */

function PaymentAction({ pmt, onViewReceipt }: { pmt: Payment; onViewReceipt: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((v) => !v)}
        style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid #E2E8F0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" }}>
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
          <div style={{ position: "absolute", right: 0, top: 36, background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, minWidth: 160, overflow: "hidden" }}>
            {[
              { icon: <Receipt size={13} />, label: "View receipt", action: () => { setOpen(false); onViewReceipt(); } },
              { icon: <Eye size={13} />, label: "View student", action: () => setOpen(false) },
              { icon: <FileText size={13} />, label: "Edit record", action: () => setOpen(false) },
            ].map(({ icon, label, action }) => (
              <button key={label} onClick={action}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "none", background: "transparent", color: "#374151", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <span style={{ color: "#64748B" }}>{icon}</span>{label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* â”€â”€â”€ Main export â”€â”€â”€ */

export function PaymentManagement() {
  const [search, setSearch] = useState("");
  const [pkgFilter, setPkgFilter] = useState("All packages");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [methodFilter, setMethodFilter] = useState("All methods");
  const [showRecord, setShowRecord] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [toast, setToast] = useState<{ receiptNo: string; amount: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSave = (print: boolean) => {
    setShowRecord(false);
    const receiptNo = `RCPT-2026-0${842 + Math.floor(Math.random() * 10)}`;
    setToast({ receiptNo, amount: "LKR 10,000" });
    if (print) setShowReceipt(true);
  };

  const filtered = PAYMENTS.filter((p) => {
    if (search && !p.student.toLowerCase().includes(search.toLowerCase()) && !p.receipt.toLowerCase().includes(search.toLowerCase())) return false;
    if (pkgFilter !== "All packages" && p.package !== pkgFilter) return false;
    if (statusFilter !== "All statuses" && p.status !== statusFilter) return false;
    if (methodFilter !== "All methods" && p.method !== methodFilter) return false;
    return true;
  });

  const metrics = [
    { icon: <TrendingUp size={18} />, label: "Total expected revenue", value: "LKR 3,850,000", sub: "across all active students", color: "#1D4ED8", bg: "#EFF6FF" },
    { icon: <Wallet size={18} />, label: "Collected this month", value: "LKR 685,000", sub: "Jul 2026", color: "#166534", bg: "#DCFCE7" },
    { icon: <Clock size={18} />, label: "Outstanding balance", value: "LKR 485,000", sub: "pending collection", color: "#92400E", bg: "#FEF3C7" },
    { icon: <AlertCircle size={18} />, label: "Overdue payments", value: "18", sub: "require follow-up", color: "#991B1B", bg: "#FEE2E2" },
  ];

  const selectStyle: React.CSSProperties = {
    height: 38, padding: "0 28px 0 10px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, color: "#475569", background: "#ffffff", cursor: "pointer", fontFamily: "inherit", outline: "none", appearance: "none", WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center", backgroundSize: 14,
  };

  return (
    <div>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
      {showRecord && <RecordPaymentModal onClose={() => setShowRecord(false)} onSave={handleSave} />}
      {showReceipt && <PrintableReceiptModal onClose={() => setShowReceipt(false)} />}

      {/* Success toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: "#1E293B", color: "#ffffff", borderRadius: 12, padding: "14px 18px", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", minWidth: 300, animation: "toastIn 0.2s ease" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CheckCircle2 size={18} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Payment recorded</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{toast.receiptNo} Â· {toast.amount}</div>
          </div>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 0 }}><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1E293B", margin: "0 0 4px" }}>Payment Management</h1>
          <div style={{ fontSize: 13, color: "#64748B" }}>Track student payments, record transactions and manage outstanding balances</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{ display: "flex", alignItems: "center", gap: 5, height: 40, padding: "0 16px", borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#ffffff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Download size={13} />Export report
          </button>
          <button onClick={() => setShowRecord(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, height: 40, padding: "0 18px", borderRadius: 8, border: "none", background: "#2563EB", color: "#ffffff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <Plus size={14} />Record payment
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {metrics.map(({ icon, label, value, sub, color, bg }) => (
          <div key={label} style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: 12 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.02em", marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input placeholder="Search by student or receipt numberâ€¦"
            style={{ width: "100%", height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 12px 0 32px", fontSize: 13, color: "#1E293B", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select style={selectStyle} value={pkgFilter} onChange={(e) => setPkgFilter(e.target.value)}>
          {PACKAGE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select style={selectStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <select style={selectStyle} value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
          {METHOD_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {["Receipt number", "Student", "Package", "Amount", "Method", "Date", "Recorded by", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const ss = STATUS_STYLE[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", fontFamily: "monospace" }}>{p.receipt}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{p.student}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "monospace" }}>{p.studentId}</div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 12, color: "#475569" }}>{p.package}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>LKR {p.amount.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 12, color: "#475569", padding: "3px 8px", background: "#F1F5F9", borderRadius: 5 }}>{p.method}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 13, color: "#475569" }}>{new Date(p.date).toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 13, color: "#475569" }}>{p.recordedBy}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 600, color: ss.color, background: ss.bg }}>
                        {p.status === "Completed" && <CheckCircle2 size={10} />}
                        {p.status === "Overdue" && <AlertCircle size={10} />}
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <PaymentAction pmt={p} onViewReceipt={() => setShowReceipt(true)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center", color: "#94A3B8" }}>
              <Receipt size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>No payments match your filters</div>
            </div>
          )}
        </div>

        {/* Table footer */}
        <div style={{ padding: "10px 16px", borderTop: "1px solid #F1F5F9", background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Showing {filtered.length} of {PAYMENTS.length} payments</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["â†", "1", "2", "3", "â†’"].map((l, idx) => (
              <button key={idx} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${l === "1" ? "#2563EB" : "#E2E8F0"}`, background: l === "1" ? "#EFF6FF" : "#ffffff", color: l === "1" ? "#2563EB" : "#64748B", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: l === "1" ? 700 : 400 }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

