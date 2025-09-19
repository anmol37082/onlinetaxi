'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './ToursSection.module.css'

const ToursSection = () => {
  const router = useRouter()
  const [tourPackages, setTourPackages] = useState([])
  const [isLoading, setIsLoading] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch tours from API
    const fetchTours = async () => {
      try {
        const res = await fetch('/api/tours')
        const data = await res.json()
        if (res.ok) {
          // Remove .slice(0, 3) to show ALL tours
          setTourPackages(data.tours || [])
          console.log('Tours fetched:', data.tours?.length || 0) // Debug log
        } else {
          console.error('Failed to load tours', data?.error)
        }
      } catch (err) {
        console.error('Error fetching tours', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  const handleLearnMore = (tour) => {
    setIsLoading(prev => ({ ...prev, [tour._id]: true }))
    const slug = tour.slug || tour._id
    if (slug) {
      router.push(`/tours/${slug}`)
    } else {
      console.error("Tour slug and _id are undefined for tour:", tour)
    }
  }

  if (loading) {
    return (
      <section className={styles.toursSection} id="tours">
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
            Loading tours...
          </div>
        </div>
      </section>
    )
  }

  if (tourPackages.length === 0) {
    return (
      <section className={styles.toursSection} id="tours">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Explore <span className={styles.highlight}>Beautiful India</span>
            </h2>
            <p className={styles.sectionDescription}>
              No tours available at the moment. Please check back later!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.toursSection} id="tours">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Explore <span className={styles.highlight}>Beautiful India</span>
          </h2>
          <p className={styles.sectionDescription}>
            Discover incredible destinations with our premium taxi tour packages.
            ({tourPackages.length} tours available)
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={3}
          navigation={true}
          pagination={{ 
            clickable: true,
            dynamicBullets: true // Better for many slides
          }}
          autoplay={{ 
            delay: 4000, // Increased delay for better UX
            disableOnInteraction: false, // Continue autoplay after user interaction
            pauseOnMouseEnter: true // Pause on hover
          }}
          loop={tourPackages.length > 3} // Enable loop only if more than 3 tours
          breakpoints={{
            320: { 
              slidesPerView: 1,
              spaceBetween: 15
            },
            640: { 
              slidesPerView: 2,
              spaceBetween: 20
            },
            1024: { 
              slidesPerView: 3,
              spaceBetween: 20
            },
          }}
        >
          {tourPackages.map((tour, index) => {
            if (!tour || (!tour.slug && !tour._id)) {
              console.error("Invalid tour object or missing slug and _id:", tour);
              return null;
            }
            return (
              <SwiperSlide key={tour._id}>
                <div className={styles.tourCard}>
                  <div className={styles.cardImageWrapper}>
                    <img 
                      src={tour.image} 
                      alt={tour.title} 
                      className={styles.cardImage}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/400/200' // Fallback image
                      }}
                    />
                    <div className={styles.destinationTag}>{tour.tag}</div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.tourTitle}>{tour.title}</h3>
                    <p className={styles.tourDescription}>{tour.description}</p>
                    <div className={styles.cardFooter}>
                      <div className={styles.tourDetails}>
                        <span className={styles.duration}>⏱️ {tour.duration}</span>
                        <span className={styles.price}>₹{tour.price}</span>
                      </div>
                      <button
                        className={styles.learnMoreBtn}
                        onClick={() => handleLearnMore(tour)}
                        disabled={isLoading[tour._id]}
                      >
                        {isLoading[tour._id] ? "Loading..." : "Learn More"}
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        
        {/* Debug info - remove this in production */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          fontSize: '14px', 
          color: '#64748b' 
        }}>
          Showing {tourPackages.length} tours
        </div>
      </div>
    </section>
  )
}

export default ToursSection
