import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  X,
  User,
  FileText,
  Package,
  FolderOpen,
  ClipboardCheck,
  AlertCircle,
  Loader2,
  Camera,
} from "lucide-react";

/* ─── Types ─── */

interface FormData {
  // Step 1
  fullName: string;
  nicOrPassport: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;

  // Step 2
  vehicleCategory: string;
  previousExperience: string;
  existingLicence: string;
  preferredLanguage: string;
  preferredTrainingDays: string[];
  preferredSessionTime: string;

  // Step 3
  trainingPackage: string;
  primaryInstructor: string;
  registrationDate: string;
  initialPayment: string;
  paymentMethod: string;

  // Step 4
  nicCopy: boolean;
  birthCertificate: boolean;
  medicalCertificate: boolean;
  passportPhoto: boolean;
  previousLicence: boolean;
}

/* ─── Static data ─── */

const VEHICLE_CATEGORIES = [
  { value: "light-vehicle", label: "Light Vehicle", desc: "Cars, SUVs (Cat. B)" },
  { value: "motorcycle", label: "Motorcycle", desc: "Motorcycles (Cat. A)" },
  { value: "three-wheeler", label: "Three-Wheeler", desc: "Tuk-tuks (Cat. C)" },
  { value: "heavy-vehicle", label: "Heavy Vehicle", desc: "Lorries, Buses (Cat. D/E)" },
  { value: "dual-purpose", label: "Dual Purpose", desc: "LV + Motorcycle combined" },
];

const PACKAGES = [
  {
    id: "std-lv",
    label: "Standard Light Vehicle Package",
    price: "LKR 45,000",
    sessions: "20 practical sessions",
    desc: "Full training for light vehicles including theory, practical & exam prep",
    category: "light-vehicle",
  },
  {
    id: "std-mc",
    label: "Motorcycle Package",
    price: "LKR 28,000",
    sessions: "15 practical sessions",
    desc: "Comprehensive motorcycle training with safety modules",
    category: "motorcycle",
  },
  {
    id: "std-tw",
    label: "Three-Wheeler Package",
    price: "LKR 22,000",
    sessions: "12 practical sessions",
    desc: "Tailored programme for three-wheeler operation",
    category: "three-wheeler",
  },
  {
    id: "std-hv",
    label: "Heavy Vehicle Package",
    price: "LKR 68,000",
    sessions: "25 practical sessions",
    desc: "Advanced heavy vehicle training with hazard perception modules",
    category: "heavy-vehicle",
  },
  {
    id: "premium-lv",
    label: "Premium Light Vehicle Package",
    price: "LKR 60,000",
    sessions: "28 practical sessions",
    desc: "Extended programme with dedicated instructor and mock trial sessions",
    category: "light-vehicle",
  },
  {
    id: "dual",
    label: "Dual Purpose Package",
    price: "LKR 65,000",
    sessions: "30 practical sessions",
    desc: "Combined light vehicle and motorcycle training",
    category: "dual-purpose",
  },
];

const INSTRUCTORS = [
  { id: "kasun", name: "Kasun Silva", speciality: "Light Vehicle · Motorcycle", available: true },
  { id: "malini", name: "Malini Fernando", speciality: "Light Vehicle · Three-Wheeler", available: true },
  { id: "ruwan", name: "Ruwan Jayasinghe", speciality: "Heavy Vehicle · Light Vehicle", available: true },
  { id: "priya", name: "Priya Dissanayake", speciality: "Motorcycle", available: false },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const INITIAL_DATA: FormData = {
  fullName: "",
  nicOrPassport: "",
  dateOfBirth: "",
  email: "",
  mobileNumber: "",
  address: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  vehicleCategory: "",
  previousExperience: "none",
  existingLicence: "no",
  preferredLanguage: "sinhala",
  preferredTrainingDays: [],
  preferredSessionTime: "morning",
  trainingPackage: "",
  primaryInstructor: "",
  registrationDate: new Date().toISOString().split("T")[0],
  initialPayment: "",
  paymentMethod: "cash",
  nicCopy: false,
  birthCertificate: false,
  medicalCertificate: false,
  passportPhoto: false,
  previousLicence: false,
};

const STEPS = [
  { id: 1, label: "Personal Details", icon: User },
  { id: 2, label: "Licence Details", icon: FileText },
  { id: 3, label: "Package & Instructor", icon: Package },
  { id: 4, label: "Documents", icon: FolderOpen },
  { id: 5, label: "Review", icon: ClipboardCheck },
];

/* ─── Shared input style helpers ─── */

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  width: "100%",
  height: 44,
  border: `1.5px solid ${hasError ? "#DC2626" : "#E2E8F0"}`,
  borderRadius: 8,
  padding: "0 14px",
  fontSize: 14,
  color: "#1E293B",
  background: "#ffffff",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
});

const selectStyle = (hasError?: boolean): React.CSSProperties => ({
  ...inputStyle(hasError),
  appearance: "none",
  WebkitAppearance: "none",
  cursor: "pointer",
  paddingRight: 36,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: 16,
});

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
  display: "block",
};

const errorStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#DC2626",
  marginTop: 5,
  display: "flex",
  alignItems: "center",
  gap: 4,
};

const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column" };

function FieldError({ msg }: { msg: string }) {
  return (
    <div style={errorStyle}>
      <AlertCircle size={11} />
      {msg}
    </div>
  );
}

/* ─── Step 1: Personal Details ─── */

function Step1({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: Record<string, string>;
  onChange: (key: keyof FormData, val: string) => void;
}) {
  return (
    <div>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#F1F5F9",
          border: "2px dashed #CBD5E1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          margin: "0 auto 28px",
          gap: 4,
        }}
      >
        <Camera size={20} color="#94A3B8" />
        <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>Photo</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
        <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
          <label style={labelStyle}>
            Full name <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            style={inputStyle(!!errors.fullName)}
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="As it appears on the National Identity Card"
          />
          {errors.fullName && <FieldError msg={errors.fullName} />}
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>
            NIC / Passport number <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            style={inputStyle(!!errors.nicOrPassport)}
            value={data.nicOrPassport}
            onChange={(e) => onChange("nicOrPassport", e.target.value)}
            placeholder="e.g. 200012345678V"
          />
          {errors.nicOrPassport && <FieldError msg={errors.nicOrPassport} />}
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>
            Date of birth <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            type="date"
            style={inputStyle(!!errors.dateOfBirth)}
            value={data.dateOfBirth}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
          />
          {errors.dateOfBirth && <FieldError msg={errors.dateOfBirth} />}
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>
            Email address <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            type="email"
            style={inputStyle(!!errors.email)}
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="student@example.com"
          />
          {errors.email && <FieldError msg={errors.email} />}
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>
            Mobile number <span style={{ color: "#DC2626" }}>*</span>
          </label>
          <input
            style={inputStyle(!!errors.mobileNumber)}
            value={data.mobileNumber}
            onChange={(e) => onChange("mobileNumber", e.target.value)}
            placeholder="+94 77 000 0000"
          />
          {errors.mobileNumber && <FieldError msg={errors.mobileNumber} />}
        </div>

        <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Residential address</label>
          <textarea
            style={{
              ...inputStyle(),
              height: 80,
              padding: "10px 14px",
              resize: "vertical",
              lineHeight: 1.5,
            }}
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Street, City, District"
          />
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Emergency contact name</label>
          <input
            style={inputStyle()}
            value={data.emergencyContactName}
            onChange={(e) => onChange("emergencyContactName", e.target.value)}
            placeholder="Parent / Guardian name"
          />
        </div>

        <div style={fieldWrap}>
          <label style={labelStyle}>Emergency contact number</label>
          <input
            style={inputStyle()}
            value={data.emergencyContactNumber}
            onChange={(e) => onChange("emergencyContactNumber", e.target.value)}
            placeholder="+94 71 000 0000"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Licence Details ─── */

function Step2({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: Record<string, string>;
  onChange: (key: keyof FormData, val: string | string[]) => void;
}) {
  const toggleDay = (day: string) => {
    const current = data.preferredTrainingDays;
    const updated = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    onChange("preferredTrainingDays", updated);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
      <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
        <label style={labelStyle}>
          Vehicle category <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {VEHICLE_CATEGORIES.map((cat) => {
            const selected = data.vehicleCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onChange("vehicleCategory", cat.value)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${selected ? "#2563EB" : errors.vehicleCategory ? "#DC2626" : "#E2E8F0"}`,
                  background: selected ? "#EFF6FF" : "#ffffff",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: selected ? "#2563EB" : "#1E293B", marginBottom: 2 }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{cat.desc}</div>
              </button>
            );
          })}
        </div>
        {errors.vehicleCategory && <FieldError msg={errors.vehicleCategory} />}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Previous driving experience</label>
        <select
          style={selectStyle()}
          value={data.previousExperience}
          onChange={(e) => onChange("previousExperience", e.target.value)}
        >
          <option value="none">None — first-time learner</option>
          <option value="informal">Some informal experience</option>
          <option value="1-2-years">1–2 years unlicensed</option>
          <option value="3-plus">3+ years unlicensed</option>
        </select>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Existing licence (other category)</label>
        <select
          style={selectStyle()}
          value={data.existingLicence}
          onChange={(e) => onChange("existingLicence", e.target.value)}
        >
          <option value="no">No existing licence</option>
          <option value="motorcycle">Motorcycle licence held</option>
          <option value="light-vehicle">Light vehicle licence held</option>
          <option value="heavy-vehicle">Heavy vehicle licence held</option>
        </select>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Preferred instruction language</label>
        <select
          style={selectStyle()}
          value={data.preferredLanguage}
          onChange={(e) => onChange("preferredLanguage", e.target.value)}
        >
          <option value="sinhala">Sinhala</option>
          <option value="tamil">Tamil</option>
          <option value="english">English</option>
        </select>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Preferred session time</label>
        <select
          style={selectStyle()}
          value={data.preferredSessionTime}
          onChange={(e) => onChange("preferredSessionTime", e.target.value)}
        >
          <option value="morning">Morning (06:00 – 11:00)</option>
          <option value="midday">Midday (11:00 – 14:00)</option>
          <option value="afternoon">Afternoon (14:00 – 17:00)</option>
          <option value="evening">Evening (17:00 – 19:00)</option>
        </select>
      </div>

      <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
        <label style={labelStyle}>Preferred training days</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {DAYS.map((day) => {
            const active = data.preferredTrainingDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                style={{
                  width: 52,
                  height: 36,
                  border: `1.5px solid ${active ? "#2563EB" : "#E2E8F0"}`,
                  borderRadius: 8,
                  background: active ? "#2563EB" : "#ffffff",
                  color: active ? "#ffffff" : "#64748B",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Package & Instructor ─── */

function Step3({
  data,
  errors,
  onChange,
}: {
  data: FormData;
  errors: Record<string, string>;
  onChange: (key: keyof FormData, val: string) => void;
}) {
  const relevantPackages = PACKAGES.filter(
    (p) => !data.vehicleCategory || p.category === data.vehicleCategory || p.category === "dual-purpose"
  );

  const selectedPkg = PACKAGES.find((p) => p.id === data.trainingPackage);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
      <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
        <label style={labelStyle}>
          Training package <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(relevantPackages.length > 0 ? relevantPackages : PACKAGES).map((pkg) => {
            const selected = data.trainingPackage === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => onChange("trainingPackage", pkg.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 8,
                  border: `1.5px solid ${selected ? "#2563EB" : errors.trainingPackage ? "#DC2626" : "#E2E8F0"}`,
                  background: selected ? "#EFF6FF" : "#ffffff",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: selected ? "#2563EB" : "#1E293B",
                      marginBottom: 2,
                    }}
                  >
                    {pkg.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>
                    {pkg.sessions} · {pkg.desc}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: selected ? "#2563EB" : "#1E293B" }}>
                    {pkg.price}
                  </div>
                  {selected && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#2563EB",
                        marginTop: 4,
                      }}
                    >
                      <Check size={11} color="#ffffff" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {errors.trainingPackage && <FieldError msg={errors.trainingPackage} />}
      </div>

      <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
        <label style={labelStyle}>
          Primary instructor <span style={{ color: "#DC2626" }}>*</span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {INSTRUCTORS.map((inst) => {
            const selected = data.primaryInstructor === inst.id;
            return (
              <button
                key={inst.id}
                onClick={() => inst.available && onChange("primaryInstructor", inst.id)}
                disabled={!inst.available}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 8,
                  border: `1.5px solid ${selected ? "#2563EB" : errors.primaryInstructor ? "#DC2626" : "#E2E8F0"}`,
                  background: !inst.available ? "#F8FAFC" : selected ? "#EFF6FF" : "#ffffff",
                  cursor: inst.available ? "pointer" : "not-allowed",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  opacity: inst.available ? 1 : 0.6,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: selected ? "#2563EB" : "#E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: selected ? "#ffffff" : "#64748B",
                    flexShrink: 0,
                  }}
                >
                  {inst.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: selected ? "#2563EB" : "#1E293B" }}>
                    {inst.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{inst.speciality}</div>
                  {!inst.available && (
                    <div style={{ fontSize: 10, color: "#DC2626", fontWeight: 500, marginTop: 1 }}>Unavailable</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {errors.primaryInstructor && <FieldError msg={errors.primaryInstructor} />}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Registration date</label>
        <input
          type="date"
          style={inputStyle()}
          value={data.registrationDate}
          onChange={(e) => onChange("registrationDate", e.target.value)}
        />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Initial payment amount (LKR)</label>
        <input
          style={inputStyle()}
          value={data.initialPayment}
          onChange={(e) => onChange("initialPayment", e.target.value)}
          placeholder={selectedPkg ? selectedPkg.price.replace("LKR ", "") : "0"}
        />
        {selectedPkg && (
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 5 }}>
            Total package: {selectedPkg.price} · Partial payments accepted
          </div>
        )}
      </div>

      <div style={{ ...fieldWrap, gridColumn: "1 / -1" }}>
        <label style={labelStyle}>Payment method</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { value: "cash", label: "Cash" },
            { value: "card", label: "Card" },
            { value: "bank-transfer", label: "Bank transfer" },
            { value: "online", label: "Online payment" },
          ].map((method) => {
            const active = data.paymentMethod === method.value;
            return (
              <button
                key={method.value}
                onClick={() => onChange("paymentMethod", method.value)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: `1.5px solid ${active ? "#2563EB" : "#E2E8F0"}`,
                  background: active ? "#2563EB" : "#ffffff",
                  color: active ? "#ffffff" : "#64748B",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {method.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Documents ─── */

const DOCS = [
  { key: "nicCopy" as keyof FormData, label: "NIC / Passport copy", required: true, desc: "Front and back scan or clear photo" },
  { key: "birthCertificate" as keyof FormData, label: "Birth certificate", required: false, desc: "Optional — used for age verification" },
  { key: "medicalCertificate" as keyof FormData, label: "Medical certificate", required: false, desc: "Required before first practical session" },
  { key: "passportPhoto" as keyof FormData, label: "Passport-size photograph", required: false, desc: "Recent photo with white background" },
  { key: "previousLicence" as keyof FormData, label: "Previous licence (if held)", required: false, desc: "Applicable when upgrading category" },
];

function Step4({
  data,
  errors,
  onToggle,
}: {
  data: FormData;
  errors: Record<string, string>;
  onToggle: (key: keyof FormData) => void;
}) {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleUpload = (key: keyof FormData) => {
    setUploading(String(key));
    setTimeout(() => {
      onToggle(key);
      setUploading(null);
    }, 1200);
  };

  return (
    <div>
      <div
        style={{
          padding: "12px 16px",
          background: "#EFF6FF",
          borderRadius: 8,
          border: "1px solid #BFDBFE",
          marginBottom: 20,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <AlertCircle size={15} color="#2563EB" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 13, color: "#1D4ED8", lineHeight: 1.5 }}>
          Upload documents in PDF, JPG, or PNG format (max 5 MB each). NIC or passport copy is required to complete
          registration. Other documents can be submitted later.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DOCS.map((doc) => {
          const uploaded = data[doc.key] as boolean;
          const isUploading = uploading === doc.key;

          return (
            <div
              key={doc.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 8,
                border: `1.5px solid ${uploaded ? "#BBF7D0" : doc.required && errors.nicCopy ? "#DC2626" : "#E2E8F0"}`,
                background: uploaded ? "#F0FDF4" : "#ffffff",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: uploaded ? "#DCFCE7" : "#F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {uploaded ? <Check size={16} color="#16A34A" /> : <FileText size={16} color="#64748B" />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{doc.label}</span>
                  {doc.required && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#DC2626",
                        background: "#FEE2E2",
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      Required
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{doc.desc}</div>
              </div>

              {uploaded ? (
                <button
                  onClick={() => onToggle(doc.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid #BBF7D0",
                    background: "#F0FDF4",
                    color: "#16A34A",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <Check size={12} />
                  Uploaded
                  <X size={10} style={{ marginLeft: 2, opacity: 0.6 }} />
                </button>
              ) : (
                <button
                  onClick={() => !isUploading && handleUpload(doc.key)}
                  disabled={isUploading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "1.5px solid #E2E8F0",
                    background: "#ffffff",
                    color: "#475569",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: isUploading ? "wait" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {isUploading ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={12} />}
                  {isUploading ? "Uploading…" : "Upload"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {errors.nicCopy && (
        <div style={{ ...errorStyle, marginTop: 12 }}>
          <AlertCircle size={13} />
          {errors.nicCopy}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Step 5: Review ─── */

function Step5({ data }: { data: FormData }) {
  const pkg = PACKAGES.find((p) => p.id === data.trainingPackage);
  const instructor = INSTRUCTORS.find((i) => i.id === data.primaryInstructor);
  const category = VEHICLE_CATEGORIES.find((c) => c.value === data.vehicleCategory);
  const uploadedDocs = DOCS.filter((d) => data[d.key]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #E2E8F0",
        borderRadius: 10,
        marginBottom: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          background: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          fontSize: 12,
          fontWeight: 700,
          color: "#64748B",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {title}
      </div>
      <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <>
      <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 13, color: "#1E293B", fontWeight: 500 }}>{value || "—"}</div>
    </>
  );

  return (
    <div>
      <div
        style={{
          padding: "12px 16px",
          background: "#FEF3C7",
          borderRadius: 8,
          border: "1px solid #FDE68A",
          marginBottom: 20,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <AlertCircle size={15} color="#92400E" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
          Please review all details carefully before submitting. A student portal account will be created upon
          submission. Details can be edited from the student profile page.
        </div>
      </div>

      <Section title="Personal details">
        <Row label="Full name" value={data.fullName} />
        <Row label="NIC / Passport" value={data.nicOrPassport} />
        <Row label="Date of birth" value={data.dateOfBirth} />
        <Row label="Email" value={data.email} />
        <Row label="Mobile" value={data.mobileNumber} />
        <Row label="Address" value={data.address} />
        <Row label="Emergency contact" value={data.emergencyContactName} />
        <Row label="Emergency number" value={data.emergencyContactNumber} />
      </Section>

      <Section title="Licence details">
        <Row label="Vehicle category" value={category?.label || data.vehicleCategory} />
        <Row label="Previous experience" value={data.previousExperience} />
        <Row label="Existing licence" value={data.existingLicence} />
        <Row label="Language" value={data.preferredLanguage} />
        <Row label="Preferred days" value={data.preferredTrainingDays.join(", ") || "Not specified"} />
        <Row label="Session time" value={data.preferredSessionTime} />
      </Section>

      <Section title="Package & instructor">
        <Row label="Training package" value={pkg?.label || data.trainingPackage} />
        <Row label="Package price" value={pkg?.price || "—"} />
        <Row label="Primary instructor" value={instructor?.name || data.primaryInstructor} />
        <Row label="Registration date" value={data.registrationDate} />
        <Row label="Initial payment" value={data.initialPayment ? `LKR ${data.initialPayment}` : "—"} />
        <Row label="Payment method" value={data.paymentMethod} />
      </Section>

      <Section title="Documents uploaded">
        <div style={{ gridColumn: "1 / -1", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {uploadedDocs.length === 0 ? (
            <span style={{ fontSize: 13, color: "#DC2626" }}>No documents uploaded — NIC copy is required</span>
          ) : (
            uploadedDocs.map((d) => (
              <span
                key={d.key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#DCFCE7",
                  color: "#16A34A",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <Check size={11} />
                {d.label}
              </span>
            ))
          )}
        </div>
      </Section>
    </div>
  );
}

/* ─── Wizard stepper ─── */

function WizardStepper({ currentStep }: { currentStep: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "24px 32px",
        borderBottom: "1px solid #E2E8F0",
        background: "#ffffff",
        gap: 0,
      }}
    >
      {STEPS.map((step, idx) => {
        const completed = currentStep > step.id;
        const active = currentStep === step.id;
        const IconComp = step.icon;

        return (
          <React.Fragment key={step.id}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: completed ? "#16A34A" : active ? "#2563EB" : "#F1F5F9",
                  border: `2px solid ${completed ? "#16A34A" : active ? "#2563EB" : "#E2E8F0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {completed ? (
                  <Check size={16} color="#ffffff" />
                ) : (
                  <IconComp size={16} color={active ? "#ffffff" : "#94A3B8"} />
                )}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  color: completed ? "#16A34A" : active ? "#2563EB" : "#94A3B8",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {step.label}
              </div>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: currentStep > idx + 1 ? "#16A34A" : "#E2E8F0",
                  marginBottom: 22,
                  transition: "background 0.2s",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Main wizard export ─── */

export function StudentRegistrationWizard({
  onSuccess,
  onCancel,
}: {
  onSuccess: (info: { name: string; id: string }) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key: keyof FormData, val: string | boolean | string[]) => {
    setData((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleDoc = (key: keyof FormData) => {
    setData((prev) => ({ ...prev, [key]: !prev[key] }));
    if (errors.nicCopy) setErrors((prev) => ({ ...prev, nicCopy: "" }));
  };

  const validate = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!data.fullName.trim()) errs.fullName = "Full name is required";
      if (!data.nicOrPassport.trim()) errs.nicOrPassport = "NIC or passport number is required";
      if (!data.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
      if (!data.email.trim()) errs.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Enter a valid email address";
      if (!data.mobileNumber.trim()) errs.mobileNumber = "Mobile number is required";
    }
    if (s === 2) {
      if (!data.vehicleCategory) errs.vehicleCategory = "Select a vehicle category";
    }
    if (s === 3) {
      if (!data.trainingPackage) errs.trainingPackage = "Select a training package";
      if (!data.primaryInstructor) errs.primaryInstructor = "Assign a primary instructor";
    }
    if (s === 4) {
      if (!data.nicCopy) errs.nicCopy = "NIC or passport copy is required before proceeding";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate(step)) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const id = `STD-2026-0${80 + Math.floor(Math.random() * 20)}`;
      onSuccess({ name: data.fullName, id });
    }, 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          onClick={onCancel}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            background: "#ffffff",
            color: "#64748B",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <ChevronLeft size={15} />
          Back to students
        </button>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", margin: 0 }}>Register new student</h1>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
            Step {step} of {STEPS.length} · {STEPS[step - 1].label}
          </div>
        </div>
      </div>

      {/* Wizard card */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <WizardStepper currentStep={step} />

        <div style={{ padding: "28px 32px" }}>
          {step === 1 && (
            <Step1
              data={data}
              errors={errors}
              onChange={(k, v) => updateField(k, v as string)}
            />
          )}
          {step === 2 && (
            <Step2
              data={data}
              errors={errors}
              onChange={(k, v) => updateField(k, v)}
            />
          )}
          {step === 3 && (
            <Step3
              data={data}
              errors={errors}
              onChange={(k, v) => updateField(k, v as string)}
            />
          )}
          {step === 4 && (
            <Step4
              data={data}
              errors={errors}
              onToggle={toggleDoc}
            />
          )}
          {step === 5 && <Step5 data={data} />}
        </div>

        {/* Navigation bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 32px",
            borderTop: "1px solid #E2E8F0",
            background: "#F8FAFC",
          }}
        >
          <button
            onClick={step === 1 ? onCancel : handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 40,
              padding: "0 18px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "#ffffff",
              color: "#475569",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <ChevronLeft size={16} />
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Step dots */}
            <div style={{ display: "flex", gap: 5, marginRight: 12 }}>
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  style={{
                    width: s.id === step ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: s.id < step ? "#16A34A" : s.id === step ? "#2563EB" : "#E2E8F0",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>

            {step < 5 ? (
              <button
                onClick={handleNext}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  height: 40,
                  padding: "0 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "#2563EB",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  height: 40,
                  padding: "0 24px",
                  borderRadius: 8,
                  border: "none",
                  background: submitting ? "#93C5FD" : "#2563EB",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: submitting ? "wait" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                    Registering student…
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    Submit registration
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
