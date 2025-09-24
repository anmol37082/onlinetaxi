'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ScrollHandlerInner() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo')
    if (scrollTo === 'booking') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const bookingSection = document.getElementById('booking')
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else if (scrollTo === 'tours') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const toursSection = document.getElementById('tours')
        if (toursSection) {
          toursSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else if (scrollTo === 'taxi-services') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const taxiServicesSection = document.getElementById('taxi-services')
        if (taxiServicesSection) {
          taxiServicesSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [searchParams])

  return null
}

export default function ScrollHandler() {
  return (
    <Suspense fallback={null}>
      <ScrollHandlerInner />
    </Suspense>
  )
}
