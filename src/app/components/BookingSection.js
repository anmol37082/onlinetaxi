'use client'

import { useState } from 'react'
import styles from './BookingSection.module.css'

const BookingSection = () => {
  const [formData, setFormData] = useState({
    service_type: '',
    trip_type: '',
    from_location: '',
    to_location: '',
    travel_date: new Date().toISOString().split('T')[0],
    customer_phone: '',
    customer_email: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Reset trip_type when service_type changes
      if (field === 'service_type') {
        updated.trip_type = ''
      }
      
      return updated
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Form submitted successfully!')
  }

  return (
    <>
      <section id="booking" className={styles.bookingSection}>
        <div className={styles.bookingContainer}>
          <div className={styles.bookingHeader}>
            <h2>Book Your Ride</h2>
            <p>Get instant quotes for your journey</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.bookingForm}>
            {/* Service Selection Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Service Type</label>
                <div className={styles.selectWrapper}>
                  <select 
                    value={formData.service_type}
                    onChange={(e) => handleInputChange('service_type', e.target.value)}
                    required
                  >
                    <option value="">Choose Service</option>
                    <option value="outstation">OutStation</option>
                    <option value="local">Local</option>
                  </select>
                  <i className="fas fa-car"></i>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Trip Type</label>
                <div className={styles.selectWrapper}>
                  <select 
                    value={formData.trip_type}
                    onChange={(e) => handleInputChange('trip_type', e.target.value)}
                    disabled={!formData.service_type}
                    required
                  >
                    <option value="">Choose Trip</option>
                    {formData.service_type === 'outstation' && (
                      <>
                        <option value="oneway">One Way</option>
                        <option value="roundtrip">Round Trip</option>
                      </>
                    )}
                    {formData.service_type === 'local' && (
                      <>
                        <option value="hourly">Hourly Basis</option>
                        <option value="airport">Airport Transfer</option>
                      </>
                    )}
                  </select>
                  <i className="fas fa-route"></i>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Travel Date</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="date"
                    value={formData.travel_date}
                    onChange={(e) => handleInputChange('travel_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <i className="fas fa-calendar-alt"></i>
                </div>
              </div>
            </div>

            {/* Location Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>From Location</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text"
                    placeholder="Enter pickup location"
                    value={formData.from_location}
                    onChange={(e) => handleInputChange('from_location', e.target.value)}
                    required
                  />
                  <i className="fas fa-map-marker-alt from-icon"></i>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>To Location</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text"
                    placeholder="Enter destination"
                    value={formData.to_location}
                    onChange={(e) => handleInputChange('to_location', e.target.value)}
                    required
                  />
                  <i className="fas fa-map-marker-alt to-icon"></i>
                </div>
              </div>
            </div>

            {/* Contact Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.customer_phone}
                    onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                  <i className="fas fa-phone"></i>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Email (Optional)</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="email"
                    placeholder="Enter your email"
                    value={formData.customer_email}
                    onChange={(e) => handleInputChange('customer_email', e.target.value)}
                  />
                  <i className="fas fa-envelope"></i>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className={styles.formSubmit}>
              <button type="submit" className={styles.submitBtn}>
                <i className="fas fa-search"></i>
                <span>Get Instant Quote</span>
              </button>
            </div>

            {/* Info */}
            <div className={styles.formInfo}>
              <div className={styles.infoItem}>
                <i className="fas fa-clock"></i>
                <span>Quick Response in 2 minutes</span>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-shield-alt"></i>
                <span>100% Safe & Secure</span>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-phone-alt"></i>
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default BookingSection
