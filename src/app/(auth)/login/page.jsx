"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get status className based on content
  const getStatusClassName = () => {
    if (status.includes("✅") || status.includes("🎉") || status.includes("successfully")) {
      return `${styles.status} ${styles.statusSuccess}`;
    } else if (status.includes("❌") || status.includes("Failed") || status.includes("Invalid")) {
      return `${styles.status} ${styles.statusError}`;
    } else if (status.includes("Sending") || status.includes("Verifying")) {
      return `${styles.status} ${styles.statusLoading}`;
    } else {
      return styles.status;
    }
  };

  // Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending OTP...");
    
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log("Send OTP Response:", data);
      
      if (res.ok) {
        setStatus("✅ OTP sent to your email. Check and verify.");
        setOtpSent(true);
      } else {
        setStatus(data?.error || "❌ Failed to send OTP");
      }
    } catch (error) {
      setStatus("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Verifying OTP...");
    
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("🎉 OTP Verified! Redirecting...");
        setTimeout(() => router.push("/profile"), 1500);
      } else {
        setStatus(data?.error || "❌ Invalid OTP");
      }
    } catch (error) {
      setStatus("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form to send new OTP
  const resetForm = () => {
    setOtpSent(false);
    setOtp("");
    setStatus("");
    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>
        {!otpSent ? "Login with Email OTP" : "Enter Verification Code"}
      </h2>

      {!otpSent ? (
        <form onSubmit={sendOtp} className={styles.form}>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={styles.input}
            disabled={loading}
          />
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading || !email.trim()}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className={styles.form}>
          <div style={{ marginBottom: '0.5rem', color: '#7c2d12', fontSize: '0.9rem', textAlign: 'center' }}>
            OTP sent to: <strong>{email}</strong>
          </div>
          <input
            required
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className={styles.input}
            maxLength="6"
            disabled={loading}
          />
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading || !otp.trim()}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button 
            type="button" 
            onClick={resetForm}
            className={styles.button}
            style={{ 
              background: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
              marginTop: '0.5rem'
            }}
            disabled={loading}
          >
            Use Different Email
          </button>
        </form>
      )}

      {status && <div className={getStatusClassName()}>{status}</div>}
    </div>
  );
}