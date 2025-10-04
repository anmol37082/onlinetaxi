'use client'
import { useState, useRef } from 'react'
import styles from './ImageUpload.module.css'

export default function ImageUpload({ onImageUpload, onUploadSuccess, currentImage, label = "Upload Image", onCancel }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 5MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)

      // Upload to server
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        if (onUploadSuccess) {
          onUploadSuccess(result.data.url)
        } else if (onImageUpload) {
          onImageUpload(result.data.url, result.data.public_id)
        }
      } else {
        setError(result.error || 'Upload failed')
        setPreview(currentImage || '')
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
      setPreview(currentImage || '')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview('')
    if (onUploadSuccess) {
      onUploadSuccess('')
    } else if (onImageUpload) {
      onImageUpload('', '')
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.uploadContainer}>
      <label className={styles.label}>{label}</label>

      {preview && (
        <div className={styles.previewContainer}>
          <img
            src={preview}
            alt="Preview"
            className={styles.previewImage}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className={styles.removeButton}
            title="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      <div className={styles.uploadArea} onClick={handleClick}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.fileInput}
        />

        {uploading ? (
          <div className={styles.uploading}>
            <div className={styles.spinner}></div>
            <span>Uploading...</span>
          </div>
        ) : (
          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon}>📁</div>
            <span>Click to select image</span>
            <small>Max size: 5MB | Formats: JPEG, PNG, WebP</small>
          </div>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  )
}
