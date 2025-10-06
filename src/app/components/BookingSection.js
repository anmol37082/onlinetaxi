'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cookieUtils } from '../../lib/cookies'
import BookingReceipt from './BookingReceipt'
import styles from './BookingSection.module.css'

const BookingSection = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    service_type: '',
    trip_type: '',
    from_location: '',
    to_location: '',
    travel_date: new Date().toISOString().split('T')[0],
    customer_phone: '',
    customer_email: '',
    package: '',
    from_airport: '',
    to_airport: '',
    city: '',
    // Additional fields from dublicate booking form
    tripCategory: '',
    tripType: '',
    localType: '',
    hours: '',
    luggage: ''
  })

  const [locations, setLocations] = useState({})
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [availableCabs, setAvailableCabs] = useState([])
  const [results, setResults] = useState([])
  const [hourlyCities, setHourlyCities] = useState([])
  const [hourlyHours, setHourlyHours] = useState([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedCab, setSelectedCab] = useState(null)
  const [showResults, setShowResults] = useState(false)




  const getAdjustedPrice = (cab) => {
    if (cab.incrementPercent) {
      return cab.Price * (1 + cab.incrementPercent / 100);
    }
    return cab.Price;
  };



  useEffect(() => {
    const api = formData.trip_type === 'oneway' ? '/api/locations' : '/api/roundtrips-locations'
    const fetchLocations = async () => {
      const res = await fetch(api)
      const data = await res.json()
      setLocations(data)
    }
    fetchLocations()
  }, [formData.trip_type])

  // Fetch hourly data when local type is hourly
  useEffect(() => {
    if (formData.trip_type === 'hourly') {
      const fetchHourlyData = async () => {
        const citiesRes = await fetch('/api/hourly-cities')
        const citiesData = await citiesRes.json()
        setHourlyCities(citiesData.cities)
        const hoursRes = await fetch('/api/hourly-hours')
        const hoursData = await hoursRes.json()
        setHourlyHours(hoursData.hours)
      }
      fetchHourlyData()
    }
  }, [formData.trip_type])



  const filteredFrom = locations.from
    ? locations.from.filter((loc) => loc.toLowerCase().startsWith(formData.from_location.toLowerCase()))
    : []

  const filteredTo = locations.toByFrom && formData.from_location
    ? (locations.toByFrom[formData.from_location] || []).filter((loc) => loc.toLowerCase().startsWith(formData.to_location.toLowerCase()))
    : []



  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      // Reset trip_type when service_type changes
      if (field === 'service_type') {
        updated.trip_type = ''
        // Reset other dependent fields
        updated.from_location = ''
        updated.to_location = ''
        updated.package = ''
        updated.from_airport = ''
        updated.to_airport = ''
        updated.city = ''
        updated.hours = ''
        setResults([])
        setShowFromDropdown(false)
        setShowToDropdown(false)
      }

      // Reset fields when trip_type changes
      if (field === 'trip_type') {
        updated.from_location = ''
        updated.to_location = ''
        updated.package = ''
        updated.from_airport = ''
        updated.to_airport = ''
        updated.city = ''
        updated.hours = ''
        setResults([])
        setShowFromDropdown(false)
        setShowToDropdown(false)
      }

      return updated
    })
  }

  const handleGetQuote = async (e) => {
    e.preventDefault()
    setResults([])
    setShowResults(false)

    try {
      let api = ''
      let body = {}

      if (formData.service_type === 'outstation') {
        if (formData.trip_type === 'oneway') {
          api = '/api/cars'
          body = { from: formData.from_location, to: formData.to_location }
        } else if (formData.trip_type === 'roundtrip') {
          api = '/api/roundtrips'
          body = { from: formData.from_location, to: formData.to_location }
        }
      } else if (formData.service_type === 'local') {
        if (formData.trip_type === 'hourly') {
          api = '/api/hourlytrips'
          body = { city: formData.city, hours: formData.hours }
        } else if (formData.trip_type === 'airport') {
          // For airport transfers, we might need a different API or handle differently
          api = '/api/cars' // Using cars API for now, might need adjustment
          body = { from: formData.from_airport, to: formData.to_airport }
        }
      }

      if (api) {
        const res = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        setResults(data)
        setAvailableCabs(data) // Keep for backward compatibility
        setShowResults(true)
        // Scroll to results table
        setTimeout(() => {
          const resultsElement = document.querySelector(`.${styles.results}`)
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      setResults([])
      setAvailableCabs([])
      setShowResults(false)
    }
  }

  const handleBookNow = (cab) => {
    const token = cookieUtils.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    const adjustedCab = { ...cab, Price: getAdjustedPrice(cab) };
    setSelectedCab(adjustedCab);
    setShowBookingModal(true);
  }



  return (
    <section id="booking" className={styles.bookingSection}>
        <div className={styles.bookingContainer}>
          <div className={styles.bookingHeader}>
            <h2>Book Your Ride</h2>
            <p>Get instant quotes for your journey</p>
          </div>

          <form onSubmit={handleGetQuote} className={styles.bookingForm}>
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

            {/* Conditional Inputs Row */}
            <div className={styles.formRow}>
              {/* Outstation oneway or roundtrip: From City and To City */}
              {formData.service_type === 'outstation' && (formData.trip_type === 'oneway' || formData.trip_type === 'roundtrip') && (
                <>
                  <div className={`${styles.formGroup} ${styles.positionRelative}`}>
                    <label>From City</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="Enter from city"
                        value={formData.from_location}
                        onChange={(e) => {
                          handleInputChange('from_location', e.target.value)
                          setShowFromDropdown(true)
                        }}
                        onFocus={() => setShowFromDropdown(true)}
                        onBlur={() => setTimeout(() => setShowFromDropdown(false), 100)}
                        required
                      />
                      <i className="fas fa-map-marker-alt from-icon"></i>
                      {showFromDropdown && (
                        <ul className={styles.dropdown}>
                          {filteredFrom.length > 0 ? (
                            filteredFrom.map((loc) => (
                              <li
                                key={loc}
                                className={styles.listGroupItem}
                                onMouseDown={() => {
                                  handleInputChange('from_location', loc)
                                  setShowFromDropdown(false)
                                  handleInputChange('to_location', '')
                                  setShowToDropdown(false)
                                }}
                              >
                                {loc}
                              </li>
                            ))
                          ) : (
                            <li className={styles.noResults}>No locations available</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className={`${styles.formGroup} ${styles.positionRelative}`}>
                    <label>To City</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="Enter to city"
                        value={formData.to_location}
                        onChange={(e) => {
                          handleInputChange('to_location', e.target.value)
                          setShowToDropdown(true)
                        }}
                        onFocus={() => setShowToDropdown(true)}
                        onBlur={() => setTimeout(() => setShowToDropdown(false), 100)}
                        readOnly={!formData.from_location}
                        required
                      />
                      <i className="fas fa-map-marker-alt to-icon"></i>
                      {showToDropdown && (
                        <ul className={styles.dropdown}>
                          {filteredTo.length > 0 ? (
                            filteredTo.map((loc) => (
                              <li
                                key={loc}
                                className={styles.listGroupItem}
                                onMouseDown={() => {
                                  handleInputChange('to_location', loc)
                                  setShowToDropdown(false)
                                }}
                              >
                                {loc}
                              </li>
                            ))
                          ) : (
                            <li className={styles.noResults}>No locations available</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Local hourly: Select City and Hours */}
              {formData.service_type === 'local' && formData.trip_type === 'hourly' && (
                <>
                  <div className={styles.formGroup}>
                    <label>Select City</label>
                    <div className={styles.selectWrapper}>
                      <select
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      >
                        <option value="">Select City</option>
                        {(hourlyCities || []).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <i className="fas fa-city"></i>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Select Hours</label>
                    <div className={styles.selectWrapper}>
                      <select
                        value={formData.hours}
                        onChange={(e) => handleInputChange('hours', e.target.value)}
                        required
                      >
                        <option value="">Select Hours</option>
                        {(hourlyHours || []).map(hour => (
                          <option key={hour} value={hour}>{hour} Hours</option>
                        ))}
                      </select>
                      <i className="fas fa-clock"></i>
                    </div>
                  </div>
                </>
              )}

              {/* Airport transfer: From Location and To Location */}
              {formData.service_type === 'local' && formData.trip_type === 'airport' && (
                <>
                  <div className={styles.formGroup}>
                    <label>From Location</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="Enter from location"
                        value={formData.from_airport}
                        onChange={(e) => handleInputChange('from_airport', e.target.value)}
                        required
                      />
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>To Location</label>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        placeholder="Enter to location"
                        value={formData.to_airport}
                        onChange={(e) => handleInputChange('to_airport', e.target.value)}
                        required
                      />
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                </>
              )}
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

          {/* Available Cabs Display */}
          {showResults && availableCabs.length > 0 && (
            <div className={styles.results}>
              <h3>Available Cabs</h3>
              <table className={styles.cabsTable}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Car</th>
                    <th>Route</th>
                    <th>Seats</th>
                    <th>Luggage</th>
                    <th>Price</th>
                    <th>Book</th>
                  </tr>
                </thead>
                <tbody>
                  {availableCabs.map((cab) => (
                    <tr key={cab._id}>
                      <td>
                        <img
                          src={cab.Imgg}
                          alt={cab.Car}
                          className={styles.tableImg}
                        />
                      </td>
                      <td>{cab.Car}</td>
                      <td>
                        {cab.City ? cab.City : cab.From} &rarr; {cab.Hours ? `${cab.Hours} Hours` : cab.To}
                      </td>
                      <td>{cab.Seats}</td>
                      <td>{cab.Luggage}</td>
                      <td>₹{getAdjustedPrice(cab)}</td>
                      <td>
                        <button
                          className={styles.bookNowBtn}
                          onClick={() => handleBookNow(cab)}
                        >
                          Book Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Booking Modal */}
          {showBookingModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <BookingReceipt
                selectedCar={selectedCab}
                routeData={null}
                onClose={() => setShowBookingModal(false)}
              />
            </div>
          )}
        </div>
      </section>
  )
}

export default BookingSection