import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PortfolioSection.module.css';

interface Project {
  _id?: string;
  id?: number;
  title: string;
  category: string;
  image: string;
  link: string;
  stats: { likes: string; views: string };
}

const PortfolioSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const r = await fetch("/api/projects");
        const data = await r.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        setProjects([]);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || projects.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 4500); // Constant rotation every 4.5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, projects.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getProjectsToDisplay = () => {
    if (projects.length === 0) return [];
    
    // We'll show 5 images in the "stage"
    const displayCount = Math.min(5, projects.length);
    const result = [];
    
    for (let i = -2; i <= 2; i++) {
      const idx = (currentIndex + i + projects.length) % projects.length;
      result.push({ ...projects[idx], offset: i });
    }

    return result;
  };

  if (projects.length === 0) {
    return (
      <section id="portfolio" className={styles.portfolioContainer}>
        <div className={styles.header}>
          <p className={styles.label}>MY WORK</p>
          <h2 className={styles.title}>Loading Your Beautiful Work...</h2>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className={styles.portfolioContainer}>
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className={styles.label}>MY WORK</p>
        <h2 className={styles.title}>Some of My Trending Work</h2>
      </motion.div>

      <div className={styles.carouselWrapper}>
        <div className={styles.stage}>
          <AnimatePresence>
            {getProjectsToDisplay().map((project) => {
              const absOffset = Math.abs(project.offset);
              const isMain = project.offset === 0;

              return (
                <motion.div 
                  key={project._id || project.id}
                  className={styles.card}
                  layout
                  initial={{ 
                    opacity: 0, 
                    scale: 0.6,
                    x: project.offset * 350,
                    z: -500,
                    rotateY: project.offset * -45 
                  }}
                  animate={{ 
                    x: project.offset * (typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 300), 
                    z: absOffset * -400, // Depth
                    rotateY: project.offset * -45, // Dramatic rotation
                    scale: 1 - absOffset * 0.15, 
                    zIndex: 10 - absOffset,
                    opacity: 1 - absOffset * 0.35,
                    filter: `blur(${absOffset * 1}px)`, 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.6,
                    x: project.offset * 350,
                    z: -500,
                    transition: { duration: 0.3 }
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 180, 
                    damping: 22, 
                    mass: 0.8,
                    opacity: { duration: 0.4 } 
                  }}
                  whileHover={isMain ? { 
                    scale: 1.05,
                    rotateY: 0,
                    z: 50,
                    transition: { duration: 0.4, ease: "easeOut" }
                  } : undefined}
                  onClick={() => {
                    if (project.offset !== 0) {
                      setIsAutoPlaying(false);
                      setCurrentIndex((prev) => (prev + project.offset + projects.length) % projects.length);
                    }
                  }}
                >
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={project.image} 
                      alt="Portfolio Item" 
                      fill 
                      className={styles.image}
                      unoptimized={true}
                      priority={project.offset === 0}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation Controls */}
          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        {/* Indicators */}
        <div className={styles.indicators}>
          {projects.map((_, idx) => (
            <button 
              key={idx} 
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ""}`}
              onClick={() => { setIsAutoPlaying(false); setCurrentIndex(idx); }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
