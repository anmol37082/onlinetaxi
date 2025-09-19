'use client'

import { useState, useEffect } from 'react'
import styles from './HeroSection.module.css'

const HeroSection = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Typing effect
  useEffect(() => {
    const words = ['Tap Away!', 'Click Away!', 'Call Away!']
    const typeSpeed = 150
    const deleteSpeed = 75
    const delayBetweenWords = 2000

    const timeout = setTimeout(() => {
      const currentWord = words[currentWordIndex]
      
      if (isDeleting) {
        setCurrentText(prev => prev.slice(0, -1))
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentWordIndex(prev => (prev + 1) % words.length)
        }
      } else {
        setCurrentText(currentWord.slice(0, currentText.length + 1))
        if (currentText === currentWord) {
          setTimeout(() => setIsDeleting(true), delayBetweenWords)
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex])

  const handleBookRide = (e) => {
    e.preventDefault()
    const bookingSection = document.getElementById('booking')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleWatchDemo = (e) => {
    e.preventDefault()
    alert('Demo video would play here!')
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBgPattern}></div>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1>
              Your Ride is Just a{' '}
              <span className={styles.highlight}>{currentText}</span>
            </h1>
            <p>
              Book your rides instantly and enjoy seamless transportation with our top online taxi platform - always reliable, always convenient.
            </p>
            <div className={styles.heroCta}>
              <button
                className={styles.ctaPrimary}
                onClick={handleBookRide}
              >
                <i className="fas fa-mobile-alt"></i>
                Book Ride Now
              </button>
              <button
                className={styles.ctaSecondary}
                onClick={handleWatchDemo}
              >
                <i className="fas fa-play"></i>
                Watch Demo
              </button>
            </div>
          </div>

          <div className={styles.heroImage}>
            <svg className={styles.heroIllustration} viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
              {/* Car Shadow */}
              <ellipse cx="250" cy="320" rx="120" ry="15" fill="rgba(0,0,0,0.1)"/>
              
              {/* Car Body */}
              <rect x="180" y="250" width="140" height="70" rx="15" fill="#4A90E2"/>
              <rect x="190" y="240" width="120" height="40" rx="10" fill="#E8F4FD"/>
              
              {/* Windows */}
              <rect x="200" y="245" width="35" height="30" rx="5" fill="#87CEEB"/>
              <rect x="265" y="245" width="35" height="30" rx="5" fill="#87CEEB"/>
              
              {/* Wheels */}
              <circle cx="210" cy="320" r="20" fill="#2C3E50"/>
              <circle cx="290" cy="320" r="20" fill="#2C3E50"/>
              <circle cx="210" cy="320" r="12" fill="#95A5A6"/>
              <circle cx="290" cy="320" r="12" fill="#95A5A6"/>
              
              {/* Driver */}
              <circle cx="285" cy="260" r="8" fill="#F4C2A1"/>
              <rect x="280" y="268" width="10" height="15" rx="2" fill="#3498DB"/>
              
              {/* Smartphone */}
              <rect x="350" y="150" width="60" height="100" rx="8" fill="#2C3E50"/>
              <rect x="355" y="160" width="50" height="80" rx="4" fill="#E8F4FD"/>
              <circle cx="380" cy="170" r="3" fill="#E74C3C"/>
              <rect x="365" y="180" width="30" height="2" rx="1" fill="#3498DB"/>
              <rect x="365" y="190" width="25" height="2" rx="1" fill="#95A5A6"/>
              <rect x="365" y="200" width="20" height="2" rx="1" fill="#95A5A6"/>
              
              {/* Location Pin */}
              <circle cx="120" cy="180" r="15" fill="#E74C3C"/>
              <circle cx="120" cy="175" r="8" fill="#FFFFFF"/>
              <polygon points="120,195 110,210 130,210" fill="#E74C3C"/>
              
              {/* Motion Lines */}
              <path d="M 140 280 Q 160 270 180 280" stroke="#BDC3C7" strokeWidth="3" fill="none" opacity="0.6"/>
              <path d="M 140 290 Q 165 280 185 290" stroke="#BDC3C7" strokeWidth="3" fill="none" opacity="0.4"/>
              <path d="M 140 300 Q 170 290 190 300" stroke="#BDC3C7" strokeWidth="3" fill="none" opacity="0.2"/>
              
              {/* WiFi Signal */}
              <circle cx="380" cy="100" r="3" fill="#2ECC71"/>
              <circle cx="380" cy="100" r="8" fill="none" stroke="#2ECC71" strokeWidth="2" opacity="0.6"/>
              <circle cx="380" cy="100" r="13" fill="none" stroke="#2ECC71" strokeWidth="2" opacity="0.4"/>
              <circle cx="380" cy="100" r="18" fill="none" stroke="#2ECC71" strokeWidth="2" opacity="0.2"/>
            </svg>
          </div>
        </div>
      </section>


    </>
  )
}

export default HeroSection