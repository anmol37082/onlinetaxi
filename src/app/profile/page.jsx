"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const [email, setEmail] = useState(""); // email show karne ke liye
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false); // form hide/show 

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { method: "GET", credentials: "include" });
        const data = await res.json();

        if (res.ok && data.success) {
          setEmail(data.user.email || "");
          setName(data.user.name || "");
          setAddress(data.user.address || "");
          setPhone(data.user.phone || "");
          if (data.user.name) setSaved(true); // agar pehle se saved hai
        } else if (res.status === 401) {
          router.push("/login");
        } else {
          setStatus("Failed to load profile");
        }
      } catch (err) {
        setStatus("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, address, phone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("✅ Profile saved successfully!");
        setSaved(true); // form hide, headings show
      } else {
        setStatus(data?.error || "❌ Failed to save profile");
      }
    } catch (err) {
      setStatus("❌ Error saving profile");
    }
  };

  const getStatusClassName = () => {
    if (status.includes("✅") || status.includes("successfully")) {
      return `${styles.status} ${styles.statusSuccess}`;
    } else if (status.includes("❌") || status.includes("Failed") || status.includes("Error")) {
      return `${styles.status} ${styles.statusError}`;
    } else {
      return `${styles.status} ${styles.statusLoading}`;
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      {!saved ? (
        <>
          <h2 className={styles.title}>Create Your Profile</h2>
          <form onSubmit={saveProfile} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Save Profile
            </button>
          </form>
        </>
      ) : (
        <div className={styles.profileSection}>
          <h2 className={styles.profileTitle}>Your Profile</h2>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Email:</span>
            <span className={styles.profileValue}>{email}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Name:</span>
            <span className={styles.profileValue}>{name}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Address:</span>
            <span className={styles.profileValue}>{address}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.profileLabel}>Phone:</span>
            <span className={styles.profileValue}>{phone}</span>
          </div>
        </div>
      )}

      {status && <div className={getStatusClassName()}>{status}</div>}
    </div>
  );
}