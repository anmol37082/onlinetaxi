import React from 'react';
import styles from './TourGuides.module.css';

const TourGuides = () => {
  const guides = [
    {
      name: "Manpreet Sidhu",
      role: "Founder and CEO",
      description: "With over 15 years of experience in the transportation industry, Manpreet has built Online Taxi into a trusted brand known for its commitment to customer satisfaction and innovation. Under his leadership, the company has expanded its services to serve customers across India.",
      avatar: "/api/placeholder/120/120"
    },
    {
      name: "Rajveer Kaur",
      role: "Operations Manager", 
      description: "Rajveer's attention to detail and problem-solving skills have been instrumental in ensuring smooth operations and exceptional service delivery. She oversees the day-to-day operations and works closely with the drivers to maintain the highest standards of safety and customer care.",
      avatar: "/api/placeholder/120/120"
    },
    {
      name: "Arjun Singh",
      role: "Customer Service Manager",
      description: "Arjun's passion for customer service and his ability to address client concerns promptly have made him a valuable asset to the Online Taxi team. He leads the customer service department, ensuring that every interaction with our customers is a positive and memorable experience.",
      avatar: "/api/placeholder/120/120"
    }
  ];

  return (
    <section className={styles.tourGuides}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Professional people</span>
          <h2 className={styles.title}>Meet our tour guides</h2>
        </div>
        
        <div className={styles.guidesGrid}>
          {guides.map((guide, index) => (
            <div key={index} className={styles.guideCard}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  <svg className={styles.avatarIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              
              <div className={styles.roleTag}>
                {guide.role}
              </div>
              
              <h3 className={styles.guideName}>{guide.name}</h3>
              
              <p className={styles.guideDescription}>
                {guide.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourGuides;