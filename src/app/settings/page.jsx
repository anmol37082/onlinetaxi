'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cookieUtils } from '../../lib/cookies'
import styles from './settings.module.css'

const SettingsPage = () => {
  const [loginHistory, setLoginHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = cookieUtils.getToken()
    if (!token) {
      router.push('/login')
      return
    }

    fetchData(token)
  }, [router])

  const fetchData = async (token) => {
    try {
      // Fetch login history
      const historyResponse = await fetch('/api/auth/login-history?page=1&limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setLoginHistory(historyData.data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Account Activity</h1>
        <p>View your login history</p>
      </div>

      <div className={styles.card}>
        <h2>Login History</h2>
        {loginHistory.length > 0 ? (
          <div className={styles.historyList}>
            {loginHistory.map((entry, index) => (
              <div key={index} className={styles.historyItem}>
                <div className={styles.historyInfo}>
                  <div className={styles.historyDate}>
                    {formatDate(entry.createdAt)}
                  </div>
                  <div className={styles.historyDetails}>
                    <strong>IP:</strong> {entry.ipAddress} |
                    <strong> Device:</strong> {entry.userAgent || 'Unknown'} |
                    <strong> Status:</strong>
                    <span className={entry.success ? styles.success : styles.error}>
                      {entry.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noData}>No login history found.</p>
        )}
      </div>
    </div>
  )
}

export default SettingsPage
