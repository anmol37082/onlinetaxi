'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { cookieUtils } from '../../lib/cookies'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [token, setToken] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== 'undefined') {
      setToken(cookieUtils.getToken())
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest(`.${styles.profileContainer}`)) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isMounted) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen, isMounted, styles.profileContainer])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const handleBookNowClick = (e) => {
    e.preventDefault()
    if (pathname === '/') {
      // On home page, scroll to booking section
      const bookingSection = document.getElementById('booking')
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // On other pages, navigate to home with scrollTo param
      router.push('/?scrollTo=booking')
    }
  }

  const handleToursClick = (e) => {
    e.preventDefault()
    if (pathname === '/') {
      // On home page, scroll to tours section
      const toursSection = document.getElementById('tours')
      if (toursSection) {
        toursSection.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // On other pages, navigate to home with scrollTo param
      router.push('/?scrollTo=tours')
    }
  }

  const handleLogout = () => {
    // Remove authentication token
    cookieUtils.removeToken()

    // Update local token state to trigger re-render
    setToken(null)

    // Close profile dropdown
    setIsProfileDropdownOpen(false)

    // Redirect to home page
    router.push('/')
  }

  return (
    <header
      className={styles.header}
      style={{
        boxShadow: isScrolled ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContainer}>
          <div className={styles.topBarLeft}>
            <i className={`fas fa-phone ${styles.topBarIcon}`}></i>
            <span>+(91) 9988-2222-83</span>
          </div>
          <div className={styles.topBarRight}>
            <Link href="#" className={styles.socialLink}>
              <i className="fab fa-instagram"></i>
            </Link>
            <Link href="#" className={styles.socialLink}>
              <i className="fab fa-facebook-f"></i>
              </Link>
            <Link href="#" className={styles.socialLink}>
              <i className="fab fa-twitter"></i>
            </Link>
            {/* Profile Icon in Top Bar */}
            {isMounted && (
              <div className={styles.profileContainer}>
                <button onClick={toggleProfileDropdown} className={styles.profileButton}>
                  <i className="fas fa-user"></i>
                </button>
                {isProfileDropdownOpen && (
                  <div className={styles.profileDropdown}>
                    <a href={token ? "/profile" : "/login"} className={styles.dropdownItem} onClick={() => setIsProfileDropdownOpen(false)}>
                      <i className="fas fa-user-circle"></i>
                      Profile
                    </a>
                    <Link href="/bookings" className={styles.dropdownItem}>
                      <i className="fas fa-calendar-alt"></i>
                      My Bookings
                    </Link>
                    <Link href="/settings" className={styles.dropdownItem}>
                      <i className="fas fa-cog"></i>
                      Settings
                    </Link>
                    <hr className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem} onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          {/* Logo - Updated to use image */}
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/images/onlinetaxi-logo.png" // Replace with your actual logo path
              alt="OnlineTaxi Logo"
              width={180}
              height={60}
              className={styles.logoImage}
              priority={true}
            />
          </Link>

          <button
            onClick={toggleMobileMenu}
            className={styles.mobileMenuToggle}
          >
            <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </button>

          <ul className={styles.navMenuDesktop}>
            <li className={styles.navMenuItem}>
              <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}>
                Home
              </Link>
            </li>
            <li className={styles.navMenuItem}>
              <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}>
                About
              </Link>
            </li>
            <li className={styles.navMenuItem}>
              <a href="#tours" className={styles.navLink} onClick={handleToursClick} suppressHydrationWarning>
                Our Tours
              </a>
            </li>
            <li className={styles.navMenuItem}>
              <Link href="/reviews" target="_blank" rel="noopener noreferrer" className={`${styles.navLink} ${pathname === '/reviews' ? styles.navLinkActive : ''}`}>
                Reviews
              </Link>
            </li>
            <li className={styles.navMenuItem}>
              <Link href="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.navLinkActive : ''}`}>
                Contact us
              </Link>
            </li>
            <li className={styles.navMenuItem}>
              <a href="#booking" className={styles.bookNowLink} onClick={handleBookNowClick}>
                Book Now
              </a>
            </li>
          </ul>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <ul className={styles.navMenuMobile}>
              <li className={styles.navMenuItem}>
                <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`} onClick={toggleMobileMenu}>
                  Home
                </Link>
              </li>
              <li className={styles.navMenuItem}>
                <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`} onClick={toggleMobileMenu}>
                  About
                </Link>
              </li>
              <li className={styles.navMenuItem}>
                <a href="#tours" className={styles.navLink} onClick={(e) => { toggleMobileMenu(); handleToursClick(e); }} suppressHydrationWarning>
                  Our Tours
                </a>
              </li>
              <li className={styles.navMenuItem}>
                <Link href="/reviews" target="_blank" rel="noopener noreferrer" className={`${styles.navLink} ${pathname === '/reviews' ? styles.navLinkActive : ''}`} onClick={toggleMobileMenu}>
                  Reviews
                </Link>
              </li>
              <li className={styles.navMenuItem}>
                <Link href="/contact" className={`${styles.navLink} ${pathname === '/contact' ? styles.navLinkActive : ''}`} onClick={toggleMobileMenu}>
                  Contact us
                </Link>
              </li>
              <li className={styles.navMenuItem}>
                <a href="#booking" className={styles.bookNowLink} onClick={(e) => { toggleMobileMenu(); handleBookNowClick(e); }}>
                  Book Now
                </a>
              </li>
              {/* Profile options in mobile menu */}
              <li className={styles.navMenuItem}>
                <a href={token ? "/profile" : "/login"} className={styles.navLink} onClick={toggleMobileMenu}>
                  <i className="fas fa-user-circle"></i> Profile
                </a>
              </li>
              <li className={styles.navMenuItem}>
                <Link href="/bookings" className={styles.navLink} onClick={toggleMobileMenu}>
                  <i className="fas fa-calendar-alt"></i> My Bookings
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
