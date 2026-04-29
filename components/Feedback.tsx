import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import styles from './Feedback.module.css';

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [singleWidth, setSingleWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);

  useEffect(() => {
    fetch("/api/feedback")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFeedbackList(data);
        } else {
          setFeedbackList([]);
        }
      })
      .catch(() => setFeedbackList([]));
  }, []);

  const startAutoScroll = (width: number) => {
    if (width === 0) return;

    const currentX = x.get();
    // Wrap currentX to be within [0, -width] range
    let startPos = currentX % width;
    if (startPos > 0) startPos -= width;

    // Slower on mobile for easier reading.
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const baseDuration = isMobile ? 140 : 70;

    controls.start({
      x: [startPos, -width],
      transition: {
        duration: baseDuration * (Math.abs(-width - startPos) / width),
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0
      }
    });
  };

  useEffect(() => {
    if (trackRef.current && feedbackList.length > 0) {
      // With 2 sets, singleWidth is exactly half of total scrollWidth
      const width = trackRef.current.scrollWidth / 2;
      setSingleWidth(width);
      startAutoScroll(width);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackList]);

  if (feedbackList.length === 0) return null;

  // Use 2 copies for the infinite loop logic
  const marqueeItems = [...feedbackList, ...feedbackList];

  return (
    <section id="feedback" className={styles.feedbackContainer}>
      <div className={styles.backdropGlow} aria-hidden="true" />
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className={styles.label}>TESTIMONIALS</p>
        <h2 className={styles.title}>What People Say</h2>
      </motion.div>

      <div className={styles.marqueeShell}>
        <div className={styles.edgeFadeLeft} aria-hidden="true" />
        <div className={styles.edgeFadeRight} aria-hidden="true" />

        <motion.div 
          ref={trackRef}
          style={{ x }}
          className={styles.marqueeTrack}
          animate={controls}
          drag="x"
          onDragStart={() => {
            controls.stop();
          }}
          onDragEnd={() => {
            startAutoScroll(singleWidth);
          }}
          whileTap={{ cursor: "grabbing" }}
        >
          {marqueeItems.map((item, index) => (
            <article
              key={`${item._id ?? item.id}-${index}`}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} />
                  ) : (
                    item.name.charAt(0)
                  )}
                </div>
                <div className={styles.identity}>
                  <h4 className={styles.name}>{item.name}</h4>
                  <p className={styles.service}>{item.role}</p>
                </div>
                <div className={styles.quoteIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.1 }}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h1.008c.5 0 .5 0 .5 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/></svg>
                </div>
              </div>

              <p className={styles.rating}>★★★★★</p>
              <p className={styles.comment}>"{item.text}"</p>
            </article>
          ))}
        </motion.div>
      </div>
      
      <p className={styles.dragHint}>← Loop Active | Drag to explore →</p>
    </section>
  );
}
