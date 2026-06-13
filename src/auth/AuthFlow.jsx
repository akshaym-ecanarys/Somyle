import { useState, useEffect, useRef } from "react";
import { Phone, ArrowLeft, Shield, Zap, User, Home, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import somyleLogo from "../assets/somyle-logo.jpg";

// ─── Small reusable pieces ────────────────────────────────────────────────────

function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 18, height: 18,
      border: "2px solid rgba(250,199,117,0.3)",
      borderTopColor: "#FAC775", borderRadius: "50%",
      animation: "pm-spin 0.7s linear infinite",
    }} />
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ef4444",
      marginBottom: 16, textAlign: "center",
    }}>
      {msg}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

// ─── Parking image cards data ─────────────────────────────────────────────────
// Using emoji + colored cards to represent parking spots (no external images needed)
const CARD_ITEMS = [
  { emoji: "🏢", label: "Office Parking",  bg: "#d4edda" },
  { emoji: "🛍️", label: "Mall Parking",    bg: "#fde8d8" },
  { emoji: "🏥", label: "Hospital Spot",   bg: "#dce8fb" },
  { emoji: "🏠", label: "Home Parking",    bg: "#e8f5e9" },
  { emoji: "✈️", label: "Airport Spot",    bg: "#fff3cd" },
  { emoji: "🎭", label: "Event Parking",   bg: "#f3e5f5" },
  { emoji: "🏋️", label: "Gym Spot",        bg: "#fce4ec" },
  { emoji: "🍽️", label: "Restaurant",      bg: "#e0f7fa" },
  { emoji: "📍", label: "Prime Location",  bg: "#f1f8e9" },
  { emoji: "🌳", label: "Shaded Parking",  bg: "#e8f5e9" },
];

function ScrollRow({ items, direction = "left", speed = 30 }) {
  // Duplicate items for seamless loop
  const all = [...items, ...items];
  const rowRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const cardW = 140 + 10; // card width + gap
    const totalW = cardW * items.length;
    const step = direction === "left" ? -0.4 : 0.4;

    function animate() {
      posRef.current += step;
      if (direction === "left" && posRef.current <= -totalW) posRef.current = 0;
      if (direction === "right" && posRef.current >= 0) posRef.current = -totalW;
      el.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    }
    if (direction === "right") posRef.current = -totalW;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [direction, items.length]);

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div ref={rowRef} style={{
        display: "flex", gap: 10, willChange: "transform",
      }}>
        {all.map((item, i) => (
          <div key={i} style={{
            minWidth: 140, height: 90,
            background: item.bg,
            borderRadius: 16,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 6, flexShrink: 0,
          }}>
            <span style={{ fontSize: 28 }}>{item.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen 1: Landing ────────────────────────────────────────────────────────

function LandingScreen({ onPhoneChosen }) {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const valid = /^[6-9]\d{9}$/.test(phone);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  function handleSend() {
    if (!valid || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPhoneChosen(`+91${phone}`);
    }, 1500);
  }

  const row1 = CARD_ITEMS.slice(0, 5);
  const row2 = CARD_ITEMS.slice(5, 10);
  const row3 = CARD_ITEMS.slice(0, 5).reverse();

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#ffffff",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* ── Top: scrolling cards area ── */}
      <div style={{
        flex: "0 0 52%",
        background: "#024027",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: "hidden",
        position: "relative",
        display: "flex", flexDirection: "column",
        justifyContent: "center", gap: 10,
        padding: "16px 0",
      }}>
        {/* somyle logo top-left */}
        <div style={{
          position: "absolute", top: 18, left: 20,
          display: "flex", alignItems: "center", gap: 8,
          zIndex: 3,
        }}>
          <img src={somyleLogo} alt="somyle" style={{
            width: 36, height: 36, borderRadius: 8, objectFit: "cover",
          }} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
            somyle
          </span>
        </div>

        {/* Gradient fade left & right edges */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to right, #024027 40px, transparent 100px, transparent calc(100% - 100px), #024027 calc(100% - 40px))",
        }} />

        {/* Scrolling rows */}
        <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 10 }}>
          <ScrollRow items={row1} direction="left"  speed={30} />
          <ScrollRow items={row2} direction="right" speed={25} />
          <ScrollRow items={row3} direction="left"  speed={35} />
        </div>
      </div>

      {/* ── Bottom: login form ── */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "28px 24px 32px",
      }}>
        {/* Heading */}
        <div style={{
          textAlign: "center", marginBottom: 28,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
          width: "100%",
        }}>
          <h1 style={{
            fontSize: 24, fontWeight: 800, color: "#0A3D20",
            margin: "0 0 4px", letterSpacing: -0.5,
          }}>
            Log in or Sign up
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            Find and book parking spots near you
          </p>
        </div>

        {/* Phone input row */}
        <div style={{
          width: "100%", maxWidth: 400,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            border: "1.5px solid #d1d5db",
            borderRadius: 14, overflow: "hidden",
            background: "#f9fafb", marginBottom: 14,
          }}>
            <div style={{
              padding: "14px 14px",
              borderRight: "1.5px solid #d1d5db",
              fontSize: 14, fontWeight: 600, color: "#374151",
              background: "#f3f4f6", whiteSpace: "nowrap",
            }}>
              🇮🇳 +91
            </div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Enter mobile number"
              autoFocus
              style={{
                flex: 1, padding: "14px 14px",
                border: "none", outline: "none",
                fontSize: 15, background: "transparent",
                color: "#111827",
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            />
          </div>

          {/* Continue button */}
          <button
            onClick={handleSend}
            disabled={!valid || loading}
            style={{
              width: "100%", padding: "15px",
              background: valid ? "#024027" : "#9ca3af",
              color: "#ffffff",
              borderRadius: 14, fontWeight: 700, fontSize: 16,
              border: "none", cursor: valid ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: "background 0.2s ease",
              boxShadow: valid ? "0 4px 16px rgba(2,64,39,0.3)" : "none",
            }}
          >
            {loading ? <Spinner /> : "Continue →"}
          </button>
        </div>

        {/* Terms */}
        <p style={{
          fontSize: 11, color: "#9ca3af", textAlign: "center",
          margin: "16px 0 0", lineHeight: 1.6,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease 0.35s",
        }}>
          By continuing you agree to somyle's{" "}
          <span style={{ color: "#024027", fontWeight: 600 }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "#024027", fontWeight: 600 }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

// ─── Screen 2: Phone number entry ────────────────────────────────────────────

function PhoneScreen({ onNext, onBack }) {
  const [phone, setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const valid = /^[6-9]\d{9}$/.test(phone);

  function handleSend() {
    if (!valid) return;
    setLoading(true);
    setError("");
    // Simulate a 1.5s API call — replace with real Firebase/backend call later
    setTimeout(() => {
      setLoading(false);
      onNext(`+91${phone}`);
    }, 1500);
  }

  return (
    <div style={styles.card}>
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={styles.iconRing}>
        <Phone size={24} color="#FAC775" />
      </div>
      <h2 style={styles.heading}>Enter your phone</h2>
      <p style={styles.sub}>We'll send a 6-digit OTP to verify your number.</p>

      <ErrorBanner msg={error} />

      <div style={styles.phoneRow}>
        <div style={styles.countryCode}>🇮🇳 +91</div>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder="98765 43210"
          style={{ ...styles.input, flex: 1, marginBottom: 0 }}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          autoFocus
        />
      </div>

      <button
        onClick={handleSend}
        disabled={!valid || loading}
        style={{ ...styles.primaryBtn, opacity: (!valid || loading) ? 0.5 : 1 }}
      >
        {loading ? <Spinner /> : "Send OTP →"}
      </button>

      <p style={styles.hint}>Standard SMS rates may apply.</p>
    </div>
  );
}

// ─── Screen 3: OTP verification ───────────────────────────────────────────────

function OTPScreen({ phone, onVerified, onBack }) {
  const [digits, setDigits]    = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState("");
  const [resendSec, setResend] = useState(30);
  const refs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (resendSec <= 0) return;
    const t = setTimeout(() => setResend(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSec]);

  function handleDigit(i, val) {
    const v    = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i]    = v;
    setDigits(next);
    // Auto-move to next box
    if (v && i < 5) refs.current[i + 1]?.focus();
    // Auto-submit when all 6 filled
    if (next.every(d => d)) submitCode(next.join(""));
  }

  function handleKeyDown(i, e) {
    // Move back on backspace
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p.length === 6) {
      setDigits(p.split(""));
      submitCode(p);
    }
  }

  function submitCode(code) {
    setLoading(true);
    setError("");
    // Simulate OTP check — replace with Firebase confirmationResult.confirm(code) later
    setTimeout(() => {
      setLoading(false);
      // For UI testing: any 6-digit code works
      // In production: only the real OTP Firebase sent will work
      onVerified(phone, true); // true = isNewUser (goes to register screen)
    }, 1500);
  }

  function handleResend() {
    setResend(30);
    setDigits(["", "", "", "", "", ""]);
    refs.current[0]?.focus();
    // TODO: call Firebase signInWithPhoneNumber again
  }

  return (
    <div style={styles.card}>
      <button onClick={onBack} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={styles.iconRing}>
        <Shield size={24} color="#FAC775" />
      </div>
      <h2 style={styles.heading}>Verify OTP</h2>
      <p style={styles.sub}>
        Enter the 6-digit code sent to{" "}
        <span style={{ color: "#FAC775", fontWeight: 600 }}>{phone}</span>
      </p>

      <ErrorBanner msg={error} />

      {/* 6 OTP boxes */}
      <div style={styles.otpRow} onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            autoFocus={i === 0}
            style={{
              ...styles.otpBox,
              borderColor: d ? "#0A3D20" : "#d1d5db",
              background:  d ? "rgba(10,61,32,0.06)" : "#f9fafb",
            }}
          />
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <Spinner />
        </div>
      )}

      {/* Resend countdown */}
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#64748b" }}>
        {resendSec > 0 ? (
          <>Resend OTP in <span style={{ color: "#0A3D20", fontWeight: 600 }}>{resendSec}s</span></>
        ) : (
          <button onClick={handleResend} style={styles.linkBtn}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Screen 4: Register (new users — name + role) ─────────────────────────────

function RegisterScreen({ phone, email, onDone }) {
  const { login }             = useAuth();
  const [name, setName]       = useState("");
  const [role, setRole]       = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    if (!name.trim() || !role) return;
    setLoading(true);
    // Simulate registration API call — replace with real backend call later
    setTimeout(() => {
      setLoading(false);
      // Log user in with a dummy token so we can see somyle after registering
      login("dummy_token_replace_with_real_jwt", {
        phone,
        email,
        name:   name.trim(),
        role,
        userId: "preview_user",
      });
    }, 1500);
  }

  const roles = [
    {
      id:     "customer",
      icon:   <User size={22} color="#5DCAA5" />,
      title:  "Customer",
      desc:   "Find & book parking spots near me",
      accent: "#5DCAA5",
    },
    {
      id:     "owner",
      icon:   <Home size={22} color="#FAC775" />,
      title:  "Owner",
      desc:   "Rent out my parking space & earn",
      accent: "#FAC775",
    },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.iconRing}>
        <Zap size={24} color="#FAC775" />
      </div>
      <h2 style={styles.heading}>Almost there!</h2>
      <p style={styles.sub}>Just a few details to set up your account.</p>

      {/* Show phone or email badge */}
      {(phone || email) && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(10,61,32,0.05)", border: "1px solid rgba(10,61,32,0.15)",
          borderRadius: 10, padding: "8px 12px", marginBottom: 20,
        }}>
          {email ? <Mail size={14} color="#0A3D20" /> : <Phone size={14} color="#0A3D20" />}
          <span style={{ fontSize: 13, color: "#0A3D20" }}>{email || phone}</span>
          <CheckCircle size={14} color="#0A3D20" style={{ marginLeft: "auto" }} />
        </div>
      )}

      {/* Name input */}
      <div style={{ marginBottom: 20 }}>
        <label style={styles.label}>YOUR NAME</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Arjun Sharma"
          autoFocus
          style={styles.input}
        />
      </div>

      {/* Role picker */}
      <label style={styles.label}>I AM A…</label>
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {roles.map(r => (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            style={{
              flex: 1, padding: "18px 12px", borderRadius: 14, cursor: "pointer",
              border:     role === r.id ? `2px solid ${r.accent}` : "1px solid rgba(255,255,255,0.1)",
              background: role === r.id ? `${r.accent}18` : "#ffffff",
              textAlign:  "center", transition: "all 0.2s",
            }}
          >
            <div style={{ marginBottom: 8 }}>{r.icon}</div>
            <div style={{
              fontSize: 14, fontWeight: 700, marginBottom: 4,
              color: role === r.id ? r.accent : "#e2e8f0",
            }}>
              {r.title}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
              {r.desc}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !role || loading}
        style={{ ...styles.primaryBtn, opacity: (!name.trim() || !role || loading) ? 0.5 : 1 }}
      >
        {loading ? <Spinner /> : "Create Account →"}
      </button>
    </div>
  );
}

// ─── Main AuthFlow — controls which screen is shown ──────────────────────────

export default function AuthFlow() {
  // step can be: "landing" | "phone" | "otp" | "register"
  const [step, setStep]   = useState("landing");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Step dot indicators
  const phoneFlow  = ["landing", "phone", "otp",      "register"];
  const googleFlow = ["landing",                       "register"];
  const flow       = email ? googleFlow : phoneFlow;
  const current    = flow.indexOf(step);

  function handlePhoneVerified(verifiedPhone, isNewUser) {
    if (isNewUser) {
      setStep("register");
    } else {
      // Existing user — go straight to app
      // TODO: call loginUser API and call login() from AuthContext
      setStep("register"); // temporary until backend is ready
    }
  }

  function handleGoogleChosen() {
    // Simulate Google returning a user — replace with real Firebase later
    setEmail("user@gmail.com");
    setStep("register");
  }

  // Landing screen gets its own fullscreen animated treatment
  if (step === "landing") {
    return (
      <>
        <style>{`
          @keyframes pm-spin { to { transform: rotate(360deg); } }
          * { box-sizing: border-box; }
        `}</style>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <LandingScreen
          onPhoneChosen={(phoneNumber) => { setPhone(phoneNumber); setStep("otp"); }}
        />
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pm-spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8f1 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px 20px",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>

        {/* Brand logo small */}
        <div style={{ marginBottom: 24 }}>
          <img
            src={somyleLogo}
            alt="somyle"
            style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover" }}
          />
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {flow.map((s, i) => (
            <div key={s} style={{
              height: 8, borderRadius: 4,
              width:      i === current ? 28 : 8,
              background: i < current
                ? "#5DCAA5"
                : i === current
                ? "#FAC775"
                : "rgba(10,61,32,0.12)",
              transition: "all 0.35s ease",
            }} />
          ))}
        </div>

        {/* Screens */}
        <div style={{ width: "100%", maxWidth: 400 }}>
          {step === "phone" && (
            <PhoneScreen
              onNext={p => { setPhone(p); setStep("otp"); }}
              onBack={() => setStep("landing")}
            />
          )}
          {step === "otp" && (
            <OTPScreen
              phone={phone}
              onVerified={handlePhoneVerified}
              onBack={() => setStep("phone")}
            />
          )}
          {step === "register" && (
            <RegisterScreen
              phone={phone}
              email={email}
              onDone={() => {}}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  card: {
    background: "#ffffff",
    border: "1px solid #d1e8d4",
    borderRadius: 20, padding: "32px 28px",
    width: "100%", position: "relative",
    boxShadow: "0 4px 24px rgba(10,61,32,0.08)",
  },
  iconRing: {
    width: 56, height: 56, borderRadius: "50%",
    background: "rgba(10,61,32,0.06)",
    border: "1.5px solid rgba(10,61,32,0.12)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 18px",
  },
  heading: {
    fontSize: 22, fontWeight: 800, color: "#0A3D20",
    margin: "0 0 6px", textAlign: "center",
  },
  sub: {
    fontSize: 13, color: "#6b7280",
    margin: "0 0 24px", textAlign: "center", lineHeight: 1.6,
  },
  label: {
    fontSize: 10, letterSpacing: 1.5, color: "#4b5563",
    display: "block", marginBottom: 8, fontWeight: 700,
  },
  input: {
    width: "100%", padding: "12px 14px",
    background: "#f9fafb",
    border: "1px solid #d1d5db",
    borderRadius: 12, color: "#111827", fontSize: 15, outline: "none",
    fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: 16,
  },
  phoneRow: {
    display: "flex", gap: 10, marginBottom: 20, alignItems: "stretch",
  },
  countryCode: {
    padding: "12px 14px",
    background: "#f9fafb",
    border: "1px solid #d1d5db",
    borderRadius: 12, fontSize: 14, color: "#374151",
    display: "flex", alignItems: "center", whiteSpace: "nowrap",
  },
  primaryBtn: {
    width: "100%", padding: "14px",
    background: "#0A3D20", color: "#ffffff",
    borderRadius: 12, fontWeight: 800, fontSize: 15,
    border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    boxShadow: "0 4px 16px rgba(10,61,32,0.25)",
    transition: "opacity 0.2s",
  },
  googleBtn: {
    width: "100%", padding: "14px",
    background: "#ffffff", color: "#1a1a1a",
    borderRadius: 14, fontWeight: 600, fontSize: 15,
    border: "1px solid #e5e7eb", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: 0,
  },
  phoneBtn: {
    width: "100%", padding: "14px",
    background: "#0A3D20", color: "#ffffff",
    borderRadius: 14, fontWeight: 600, fontSize: 15,
    border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    boxShadow: "0 4px 16px rgba(10,61,32,0.2)",
  },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "14px 0" },
  dividerLine: { flex: 1, height: 1, background: "#e5e7eb" },
  dividerText: { fontSize: 12, color: "#9ca3af" },
  hint: {
    fontSize: 11, color: "#9ca3af",
    textAlign: "center", margin: "14px 0 0", lineHeight: 1.6,
  },
  otpRow: {
    display: "flex", gap: 10,
    justifyContent: "center", marginBottom: 8,
  },
  otpBox: {
    width: 46, height: 54, textAlign: "center",
    fontSize: 22, fontWeight: 700, color: "#0A3D20",
    borderRadius: 12, border: "1.5px solid",
    outline: "none", transition: "all 0.2s",
    fontFamily: "monospace", background: "transparent",
  },
  backBtn: {
    position: "absolute", top: 18, left: 18,
    background: "none", border: "none",
    color: "#6b7280", fontSize: 13, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 4,
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  linkBtn: {
    background: "none", border: "none",
    color: "#0A3D20", fontSize: 13,
    cursor: "pointer", fontWeight: 700, padding: 0,
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
};