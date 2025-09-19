"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  // Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setStatus("Sending OTP...");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    console.log("Verify OTP Response:", data);
    if (res.ok) {
      setStatus("✅ OTP sent to your email. Check and verify.");
      setOtpSent(true);
    } else {
      setStatus(data?.error || "❌ Failed to send OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setStatus("Verifying OTP...");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: otp }), // ✅ backend "code" expect करता है
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("🎉 OTP Verified! Redirecting...");
      localStorage.setItem("token", data.token); // ✅ save JWT
      setTimeout(() => router.push("/profile"), 1500); // ✅ profile page redirect
    } else {
      setStatus(data?.error || "❌ Invalid OTP");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.title}>Login with Email OTP</h2>

      {!otpSent ? (
        <form onSubmit={sendOtp} className={styles.form}>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className={styles.form}>
          <input
            required
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Verify OTP
          </button>
        </form>
      )}

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
