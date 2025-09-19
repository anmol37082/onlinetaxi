"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import styles from "./ScrollToTopButton.module.css";

const ScrollToTopButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200); // 200px scroll hone par dikhna shuru
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`${styles.scrollToTop} ${showScrollTop ? styles.visible : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className={styles.scrollIcon} />
    </button>
  );
};

export default ScrollToTopButton;
