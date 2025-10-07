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
            
            </div>
          </div>

          <div className={styles.heroImage}>
            <img
              src="/images/herosectionimg.png"
              alt="Hero Section"
              className={styles.heroIllustration}
            />
          </div>
        </div>
      </section>


    </>
  )
}

export default HeroSection