'use client'
import { useState, useEffect } from 'react'
import styles from './AdminTours.module.css'
import AdminAuthWrapper from '../../components/AdminAuthWrapper'
import ImageUpload from '../../../components/ImageUpload'

export default function AdminTours() {
  const [tours, setTours] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    imagePublicId: '',
    tag: '',
    duration: '',
    price: '',
    rating: 5,
    days: [], // Array of itinerary days
    summaryTitle: 'Summary of the Itinerary',
    summaryText: '',
    travelTipsTitle: 'Travel Tips',
    travelTips: [],
    closingParagraph: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch tours
  const fetchTours = async () => {
    try {
      const res = await fetch('/api/tours')
      const data = await res.json()
      if (res.ok) setTours(data.tours)
    } catch (error) {
      console.error('Error fetching tours:', error)
    }
  }
  useEffect(() => { fetchTours() }, [])

  // Input change handler
  const handleInputChange = (field, value) => {
    const updatedForm = { ...form, [field]: value }

    // Auto-generate slug from title
    if (field === 'title') {
      updatedForm.slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
    }

    setForm(updatedForm)
  }

  // Handle image upload
  const handleImageUpload = (imageUrl, publicId) => {
    setForm({ ...form, image: imageUrl, imagePublicId: publicId })
  }

  // Add new day in itinerary
  const handleAddDay = () => {
    const newDay = {
      dayTitle: `Day ${form.days.length + 1}`,
      morning: '',
      afternoon: '',
      evening: '',
      night: ''
    }
    setForm({ ...form, days: [...form.days, newDay] })
  }

  // Update day details
  const handleDayChange = (index, part, value) => {
    const updatedDays = [...form.days]
    updatedDays[index][part] = value
    setForm({ ...form, days: updatedDays })
  }

  // Remove a day
  const handleRemoveDay = (index) => {
    const updatedDays = form.days.filter((_, i) => i !== index)
    setForm({ ...form, days: updatedDays })
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = '/api/tours'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editingId })
      })
      const data = await res.json()

      if (res.ok) {
        fetchTours()
        setForm({
          title: '',
          description: '',
          image: '',
          imagePublicId: '',
          tag: '',
          duration: '',
          price: '',
          rating: 5,
          days: [],
          summaryTitle: 'Summary of the Itinerary',
          summaryText: '',
          travelTipsTitle: 'Travel Tips',
          travelTips: [],
          closingParagraph: ''
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

  // Edit tour
  const handleEdit = (tour) => {
    setForm({ 
      ...tour,
      imagePublicId: tour.imagePublicId || ''
    })
    setEditingId(tour._id)
  }

  // Delete tour
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      try {
        await fetch(`/api/tours?id=${id}`, { method: 'DELETE' })
        fetchTours()
      } catch (error) {
        alert('Error deleting tour. Please try again.')
      }
    }
  }

  return (
    <AdminAuthWrapper>
      <div className={styles.container}>
        <h1 className={styles.title}>Admin: Manage Tours</h1>

        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basic Info */}
            <input className={styles.input} type="text" placeholder="Tour Title" value={form.title} onChange={e => handleInputChange('title', e.target.value)} required />
            <input className={styles.input} type="text" placeholder="Tour Tag" value={form.tag} onChange={e => handleInputChange('tag', e.target.value)} required />
            <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Tour Description" value={form.description} onChange={e => handleInputChange('description', e.target.value)} required />
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              currentImage={form.image} 
              label="Tour Image" 
            />
            <input className={styles.input} type="text" placeholder="Duration (e.g., 3 days)" value={form.duration} onChange={e => handleInputChange('duration', e.target.value)} required />
            <input className={styles.input} type="number" placeholder="Price" value={form.price} onChange={e => handleInputChange('price', e.target.value)} required />
            <input className={styles.input} type="number" placeholder="Rating (1-5)" min="1" max="5" value={form.rating} onChange={e => handleInputChange('rating', e.target.value)} required />

            {/* Days Dynamic Section */}
            <h3>Itinerary Days</h3>
            {form.days.map((day, index) => (
              <div key={index} className={styles.dayBox}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Day Title (e.g., Day 1: Arrival in Delhi)"
                  value={day.dayTitle}
                  onChange={(e) => handleDayChange(index, 'dayTitle', e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Morning Plan"
                  value={day.morning}
                  onChange={(e) => handleDayChange(index, 'morning', e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Afternoon Plan"
                  value={day.afternoon}
                  onChange={(e) => handleDayChange(index, 'afternoon', e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Evening Plan"
                  value={day.evening}
                  onChange={(e) => handleDayChange(index, 'evening', e.target.value)}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Night Plan"
                  value={day.night}
                  onChange={(e) => handleDayChange(index, 'night', e.target.value)}
                />
                <button type="button" onClick={() => handleRemoveDay(index)} className={styles.deleteButton}>
                  Remove Day
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddDay} className={styles.addDayButton}>+ Add Day</button>

            {/* Extra Sections */}
            <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Summary of the Itinerary" value={form.summaryText} onChange={e => handleInputChange('summaryText', e.target.value)} />
            <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Travel Tips (one per line)" value={form.travelTips.join('\n')} onChange={e => handleInputChange('travelTips', e.target.value.split('\n'))} />
            <textarea className={`${styles.input} ${styles.textarea}`} placeholder="Closing Paragraph" value={form.closingParagraph} onChange={e => handleInputChange('closingParagraph', e.target.value)} />

            {/* Submit */}
            <button type="submit" className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (editingId ? 'Update Tour' : 'Add New Tour')}
            </button>
          </form>
        </div>

        {/* Show Tours */}
        <div className={styles.toursSection}>
          <h2 className={styles.sectionTitle}>All Tours ({tours.length})</h2>
          {tours.length === 0 ? (
            <div className={styles.emptyState}>No tours available. Add your first tour above!</div>
          ) : (
            <ul className={styles.toursList}>
              {tours.map(tour => (
                <li key={tour._id} className={styles.tourItem}>
                  <div className={styles.tourInfo}>
                    <h3 className={styles.tourTitle}>{tour.title}</h3>
                    <div className={styles.tourDetails}>
                      <span className={styles.tourTag}>{tour.tag}</span>
                      <span className={styles.tourPrice}>₹{tour.price}</span>
                      <span className={styles.tourRating}>⭐ {tour.rating}</span>
                      <span className={styles.tourDuration}>🕒 {tour.duration}</span>
                    </div>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleEdit(tour)} className={styles.editButton}>Edit</button>
                    <button onClick={() => handleDelete(tour._id)} className={styles.deleteButton}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminAuthWrapper>
  )
}
