'use client';

import React from 'react';
import { Car, Navigation, MapPin, Plane } from 'lucide-react';

const TaxiServicesPage = () => {
  const services = [
    {
      id: 'roundtrip-cabs',
      icon: <Car size={48} />,
      title: "Roundtrip Cabs",
      description: "Convenient roundtrip rides with Online Taxi to take you there and back, with transparent pricing and reliable drivers committed to your satisfaction."
    },
    {
      id: 'oneway-drops',
      icon: <Navigation size={48} />,
      title: "Oneway Drops", 
      description: "One-way taxi services with Online Taxi to get you to your destination quickly and safely, without the hassle of arranging your return trip."
    },
    {
      id: 'local-rentals',
      icon: <MapPin size={48} />,
      title: "Local Rentals",
      description: "Rent a taxi with Online Taxi for the day and explore the local sights at your own pace. Enjoy the flexibility and convenience of on-demand transportation."
    },
    {
      id: 'airport-transfers', 
      icon: <Plane size={48} />,
      title: "Airport Transfers",
      description: "Stress-free airport pickups and drop-offs with Online Taxi, featuring flight monitoring and professional drivers to ensure you arrive on time for your travels."
    }
  ];

  return (
    <>
      <style>{`
        .services-wrapper {
          background: #fff3db;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }
        
        .services-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 100px 20px;
        }
        
        .header-section {
          text-align: center;
          margin-bottom: 80px;
          position: relative;
        }
        
        .subtitle {
          color: #ff6b35;
          font-weight: 700;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 20px;
          position: relative;
          display: inline-block;
        }
        
        .subtitle::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #ff6b35, #ff8f65);
          border-radius: 2px;
        }
        
        .main-title {
          font-size: 4rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 20px;
          line-height: 1.2;
          letter-spacing: -1px;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-bottom: 60px;
        }
        
        /* Tablet - 2 cards per row */
        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
        }
        
        /* Mobile - 1 card per row */
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }
        }
        
        .service-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 40px 25px 35px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 107, 53, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          height: 100%;
          min-height: 350px;
        }
        
        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #ff6b35, #ff8f65, #ffab91);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        
        .service-card:hover::before {
          transform: scaleX(1);
        }
        
        .service-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 25px 60px rgba(255, 107, 53, 0.15);
          border-color: rgba(255, 107, 53, 0.3);
        }
        
        .icon-wrapper {
          position: relative;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .icon-circle {
          width: 85px;
          height: 85px;
          background: linear-gradient(135deg, #ff6b35 0%, #ff8f65 50%, #ffab91 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 30px rgba(255, 107, 53, 0.3);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        
        .icon-circle::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: rotate(45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }
        
        .service-card:hover .icon-circle::before {
          opacity: 1;
          transform: rotate(45deg) translate(100%, 100%);
        }
        
        .service-card:hover .icon-circle {
          transform: scale(1.15) rotate(10deg);
          box-shadow: 0 20px 40px rgba(255, 107, 53, 0.4);
        }
        
        .service-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 18px;
          text-align: center;
          transition: color 0.3s ease;
          line-height: 1.3;
        }
        
        .service-card:hover .service-title {
          color: #ff6b35;
        }
        
        .service-description {
          color: #666666;
          font-size: 14px;
          line-height: 1.6;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .decorative-bg-1 {
          position: absolute;
          top: 10%;
          left: -5%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .decorative-bg-2 {
          position: absolute;
          bottom: 15%;
          right: -5%;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(255, 143, 101, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite reverse;
        }
        
        .decorative-bg-3 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 171, 145, 0.05) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 4s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1); 
            opacity: 0.1;
          }
        }
        
        @media (max-width: 768px) {
          .services-container {
            padding: 60px 15px;
          }
          
          .main-title {
            font-size: 2.5rem;
          }
          
          .service-card {
            padding: 35px 20px 30px;
            min-height: 320px;
          }
          
          .icon-circle {
            width: 75px;
            height: 75px;
          }
          
          .service-title {
            font-size: 1.3rem;
          }
          
          .service-description {
            font-size: 13px;
          }
        }
        
        @media (max-width: 480px) {
          .main-title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 14px;
            letter-spacing: 2px;
          }
          
          .service-card {
            min-height: 300px;
          }
        }
        
        /* Large screens - ensure cards don't get too wide */
        @media (min-width: 1400px) {
          .services-grid {
            gap: 40px;
          }
          
          .service-card {
            max-width: 320px;
            margin: 0 auto;
          }
        }
      `}</style>
      
      <div className="services-wrapper" id="taxi-services">
        {/* Decorative Background Elements */}
        <div className="decorative-bg-1" aria-hidden="true"></div>
        <div className="decorative-bg-2" aria-hidden="true"></div>
        <div className="decorative-bg-3" aria-hidden="true"></div>
        
        <div className="services-container">
          {/* Header Section */}
          <div className="header-section">
            <p className="subtitle">
              WHY CHOOSE ONLINE TAXI
            </p>
            <h1 className="main-title">
              Explore Our Benefits
            </h1>
          </div>

          {/* Services Grid */}
          <div className="services-grid">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className="service-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Icon Container */}
                <div className="icon-wrapper">
                  <div className="icon-circle">
                    <div className="text-white">
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h2 className="service-title">
                  {service.title}
                </h2>
                <p className="service-description">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxiServicesPage;