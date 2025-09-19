"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const verify = async (e) => {
    e.preventDefault();
    setStatus("Verifying...");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    console.log("Verify OTP Response:", data);
    if (res.ok) {
      // Save token in localStorage (or cookie) and redirect to profile
      localStorage.setItem("token", data.token);
      setStatus("Verified! Redirecting...");
      router.push("/profile");
    } else {
      setStatus(data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2>Verify OTP</h2>
      <form onSubmit={verify} className="space-y-3">
        <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full p-2 border rounded" />
        <input required type="text" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="6-digit code" className="w-full p-2 border rounded" />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Verify</button>
      </form>
      {status && <p className="mt-3">{status}</p>}
    </div>
  );
}
