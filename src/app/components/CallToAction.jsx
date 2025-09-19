"use client";
import Image from "next/image";
import styles from "./CallToAction.module.css";

export default function CallToAction() {
  return (
    <section className={styles.tripPlanner}>
      <div className={styles.container}>
        {/* Navigation dots */}
        <div className={styles.navDots}>
          <div className={`${styles.dot} ${styles.activeDot}`}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
        
        <div className={styles.content}>
          {/* Left Content */}
          <div className={styles.leftContent}>
            <div className={styles.textContent}>
              <span className={styles.subtitle}>Plan your trip with us</span>
              <h1 className={styles.title}>
                Ready for An<br />
                Unforgettable Tour?
              </h1>
              <button className={styles.ctaButton}>
                <span>Book Your Tour</span>
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right Content - Illustration */}
          <div className={styles.rightContent}>
            <div className={styles.illustrationWrapper}>
              {/* Background Elements */}
              <div className={styles.cityscape}>
                <div className={`${styles.building} ${styles.building1}`}></div>
                <div className={`${styles.building} ${styles.building2}`}></div>
                <div className={`${styles.building} ${styles.building3}`}></div>
                <div className={`${styles.building} ${styles.building4}`}></div>
                <div className={`${styles.building} ${styles.building5}`}></div>
              </div>
              
              {/* Phone */}
              <div className={styles.phone}>
                <div className={styles.phoneScreen}>
                  <div className={styles.phoneHeader}>TAXI</div>
                  <div className={styles.phoneContent}>
                    <div className={styles.mapIcon}></div>
                    <div className={styles.routeLine}></div>
                  </div>
                </div>
              </div>
              
              {/* Taxi */}
              <div className={styles.taxi}>
                <div className={styles.taxiBody}>
                  <div className={styles.taxiRoof}>
                    <div className={styles.taxiSign}>TAXI</div>
                  </div>
                  <div className={styles.taxiWindows}></div>
                  <div className={styles.taxiDoor}></div>
                </div>
                <div className={styles.taxiWheels}>
                  <div className={`${styles.wheel} ${styles.frontWheel}`}></div>
                  <div className={`${styles.wheel} ${styles.rearWheel}`}></div>
                </div>
              </div>
              
              {/* Person */}
              <div className={styles.person}>
                <div className={styles.personHead}></div>
                <div className={styles.personBody}></div>
                <div className={styles.personArm}></div>
              </div>
              
              {/* Trees */}
              <div className={`${styles.tree} ${styles.tree1}`}>
                <div className={styles.treeTrunk}></div>
                <div className={styles.treeLeaves}></div>
              </div>
              <div className={`${styles.tree} ${styles.tree2}`}>
                <div className={styles.treeTrunk}></div>
                <div className={styles.treeLeaves}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}

