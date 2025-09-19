'use client'
import { useState, useEffect } from 'react'
import styles from './AdminTopRoutes.module.css'

export default function AdminTopRoutes() {
  const [toproutes, setToproutes] = useState([])
  const [form, setForm] = useState({
    title: '',
    slug: '',
    image: '',
    imageAlt: '',
    distance: '',
    duration: '',
    carType: '',
    currentPrice: '',
    originalPrice: '',
    discount: '',
    description: '',
    features: '',
    fromCity: '',
    toCity: '',
    introHeading: '',
    introParagraph: '',
    overviewHeading: '',
    overviewParagraph: '',
    aboutHeading: '',
    aboutParagraph: '',
    journeyHeading: '',
    journeyParagraph: '',
    destinationHeading: '',
    destinationParagraph: '',
    sightseeing: '',
    whyHeading: '',
    whyPoints: '',
    discoverHeading: '',
    discoverParagraph: '',
    attractions: '',
    bookingHeading: '',
    bookingParagraph: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTopRoutes = async () => {
    try {
      const res = await fetch('/api/toproutes')
      const data = await res.json()
      if (res.ok) setToproutes(data.toproutes || [])
    } catch (error) {
      console.error('Error fetching toproutes:', error)
    }
  }

  useEffect(() => { fetchTopRoutes() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = '/api/toproutes'
      const method = editingId ? 'PUT' : 'POST'
      const featuresArray = form.features.split(',').map(f => f.trim()).filter(f => f)
      const sightseeingArray = form.sightseeing.split(',').map(s => s.trim()).filter(s => s)
      const whyPointsArray = form.whyPoints.split(',').map(w => w.trim()).filter(w => w)
      const attractionsArray = form.attractions.split(',').map(a => a.trim()).filter(a => a)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          currentPrice: parseFloat(form.currentPrice),
          originalPrice: parseFloat(form.originalPrice),
          discount: parseFloat(form.discount),
          features: featuresArray,
          sightseeing: sightseeingArray,
          whyPoints: whyPointsArray,
          attractions: attractionsArray,
          id: editingId
        })
      })
      const data = await res.json()

      if (res.ok) {
        fetchTopRoutes()
        setForm({
          title: '',
          slug: '',
          image: '',
          imageAlt: '',
          distance: '',
          duration: '',
          carType: '',
          currentPrice: '',
          originalPrice: '',
          discount: '',
          description: '',
          features: '',
          fromCity: '',
          toCity: '',
          introHeading: '',
          introParagraph: '',
          overviewHeading: '',
          overviewParagraph: '',
          aboutHeading: '',
          aboutParagraph: '',
          journeyHeading: '',
          journeyParagraph: '',
          destinationHeading: '',
          destinationParagraph: '',
          sightseeing: '',
          whyHeading: '',
          whyPoints: '',
          discoverHeading: '',
          discoverParagraph: '',
          attractions: '',
          bookingHeading: '',
          bookingParagraph: ''
        })
        setEditingId(null)
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (toproute) => {
    setForm({
      ...toproute,
      features: toproute.features.join(', '),
      sightseeing: toproute.sightseeing.join(', '),
      whyPoints: toproute.whyPoints.join(', '),
      attractions: toproute.attractions.join(', ')
    })
    setEditingId(toproute._id)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this toproute?')) {
      try {
        await fetch(`/api/toproutes?id=${id}`, { method: 'DELETE' })
        fetchTopRoutes()
      } catch (error) {
        alert('Error deleting toproute. Please try again.')
      }
    }
  }

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin: Manage Top Routes</h1>

      <div className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Route Title"
              value={form.title}
              onChange={e => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Slug (e.g., chandigarh-to-amritsar)"
              value={form.slug}
              onChange={e => handleInputChange('slug', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Image URL"
              value={form.image}
              onChange={e => handleInputChange('image', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Image Alt Text"
              value={form.imageAlt}
              onChange={e => handleInputChange('imageAlt', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Distance (e.g., 230 KM)"
              value={form.distance}
              onChange={e => handleInputChange('distance', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Duration (e.g., 4-5 Hours)"
              value={form.duration}
              onChange={e => handleInputChange('duration', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Car Type (e.g., AC Sedan)"
              value={form.carType}
              onChange={e => handleInputChange('carType', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="number"
              placeholder="Current Price"
              value={form.currentPrice}
              onChange={e => handleInputChange('currentPrice', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="number"
              placeholder="Original Price"
              value={form.originalPrice}
              onChange={e => handleInputChange('originalPrice', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Discount (%)"
              value={form.discount}
              onChange={e => handleInputChange('discount', e.target.value)}
              required
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Route Description"
              value={form.description}
              onChange={e => handleInputChange('description', e.target.value)}
              required
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Features (comma-separated, e.g., Professional Driver, Clean Vehicle)"
              value={form.features}
              onChange={e => handleInputChange('features', e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="From City"
              value={form.fromCity}
              onChange={e => handleInputChange('fromCity', e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="To City"
              value={form.toCity}
              onChange={e => handleInputChange('toCity', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              className={styles.input}
              type="text"
              placeholder="Intro Heading"
              value={form.introHeading}
              onChange={e => handleInputChange('introHeading', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Intro Paragraph"
              value={form.introParagraph}
              onChange={e => handleInputChange('introParagraph', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              className={styles.input}
              type="text"
              placeholder="Overview Heading"
              value={form.overviewHeading}
              onChange={e => handleInputChange('overviewHeading', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Overview Paragraph"
              value={form.overviewParagraph}
              onChange={e => handleInputChange('overviewParagraph', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              className={styles.input}
              type="text"
              placeholder="About Heading"
              value={form.aboutHeading}
              onChange={e => handleInputChange('aboutHeading', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="About Paragraph"
              value={form.aboutParagraph}
              onChange={e => handleInputChange('aboutParagraph', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              className={styles.input}
              type="text"
              placeholder="Journey Heading"
              value={form.journeyHeading}
              onChange={e => handleInputChange('journeyHeading', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Journey Paragraph"
              value={form.journeyParagraph}
              onChange={e => handleInputChange('journeyParagraph', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              className={styles.input}
              type="text"
              placeholder="Destination Heading"
              value={form.destinationHeading}
              onChange={e => handleInputChange('destinationHeading', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Destination Paragraph"
              value={form.destinationParagraph}
              onChange={e => handleInputChange('destinationParagraph', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Sightseeing (comma-separated)"
              value={form.sightseeing}
              onChange={e => handleInputChange('sightseeing', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              className={styles.input}
              type="text"
              placeholder="Why Heading"
              value={form.whyHeading}
              onChange={e => handleInputChange('whyHeading', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Why Points (comma-separated)"
              value={form.whyPoints}
              onChange={e => handleInputChange('whyPoints', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              className={styles.input}
              type="text"
              placeholder="Discover Heading"
              value={form.discoverHeading}
              onChange={e => handleInputChange('discoverHeading', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Discover Paragraph"
              value={form.discoverParagraph}
              onChange={e => handleInputChange('discoverParagraph', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Attractions (comma-separated)"
              value={form.attractions}
              onChange={e => handleInputChange('attractions', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              className={styles.input}
              type="text"
              placeholder="Booking Heading"
              value={form.bookingHeading}
              onChange={e => handleInputChange('bookingHeading', e.target.value)}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              placeholder="Booking Paragraph"
              value={form.bookingParagraph}
              onChange={e => handleInputChange('bookingParagraph', e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? '' : (editingId ? 'Update Route' : 'Add New Route')}
          </button>
        </form>
      </div>

      <div className={styles.toproutesSection}>
        <h2 className={styles.sectionTitle}>All Top Routes ({toproutes.length})</h2>
        {toproutes.length === 0 ? (
          <div className={styles.emptyState}>
            No top routes available. Add your first route above!
          </div>
        ) : (
          <ul className={styles.toproutesList}>
            {toproutes.map(toproute => (
              <li key={toproute._id} className={styles.toprouteItem}>
                <div className={styles.toprouteInfo}>
                  <h3 className={styles.toprouteTitle}>{toproute.title}</h3>
                  <div className={styles.toprouteDetails}>
                    <span className={styles.toprouteDistance}>{toproute.distance}</span>
                    <span className={styles.toproutePrice}>₹{toproute.currentPrice}</span>
                    <span className={styles.toprouteDiscount}>{toproute.discount}% OFF</span>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => handleEdit(toproute)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(toproute._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
