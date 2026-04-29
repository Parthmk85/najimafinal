import React, { useState, useEffect } from "react";

import { motion, type Variants } from "framer-motion";
import styles from "./Services.module.css";

// Premium SVG icon components
const icons = {
  car: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h12l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17" r="1.5" /><circle cx="16.5" cy="17" r="1.5" />
      <path d="M7.5 15.5h9" />
    </svg>
  ),
  film: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  ),
  instagram: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  ring: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="14" r="7" />
      <path d="M12 7V3" /><path d="M8 3h8" />
      <path d="M9.5 7 8 3" /><path d="M14.5 7 16 3" />
    </svg>
  ),
  video: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  cake: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" /><path d="M7 8v2" /><path d="M12 8v2" /><path d="M17 8v2" />
      <path d="M7 4 8 2 9 4" /><path d="M12 4l1-2 1 2" /><path d="M17 4l1-2 1 2" />
    </svg>
  ),
  home: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  clapperboard: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4a2 2 0 0 1 2.5 1.3Z" />
      <path d="m6.2 5.3 3.1 3.9" /><path d="m12.4 3.4 3.1 3.9" />
      <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  ),
  stars: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  bag: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  briefcase: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Services() {
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [activeFeatured, setActiveFeatured] = useState<any>(null);

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mainFeatured = data.find((s: any) => s.isFeatured) || data[0];
          setActiveFeatured({
            ...mainFeatured,
            icon: (icons as any)[mainFeatured.icon] || icons.car,
            tag: mainFeatured.tag || "★ Featured"
          });
          const mapped = data.map((s: any) => ({
            ...s,
            icon: (icons as any)[s.icon] || icons.film
          }));
          setServiceList(mapped);
        } else {
          setServiceList([]);
          setActiveFeatured(null);
        }
      })
      .catch(() => { setServiceList([]); setActiveFeatured(null); });
  }, []);

  if (serviceList.length === 0) return null;

  return (
    <section id="services" className={styles.section}>

      {/* ── Section Label ── */}
      <div className={styles.labelRow}>
        <span className={styles.labelLine} />
        <span className={styles.labelText}>What I Offer</span>
        <span className={styles.labelLine} />
      </div>
      <h2 className={styles.heading}>Services</h2>

      {/* ── FEATURED Hero Strip ── */}
      {activeFeatured && (
        <motion.div
          className={styles.featuredCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <div className={styles.featuredLeft}>
            <span className={styles.featuredTag}>{activeFeatured.tag}</span>
            <div className={styles.featuredIconRow}>
              <span className={styles.featuredIcon}>{activeFeatured.icon}</span>
              <h3 className={styles.featuredTitle}>{activeFeatured.title}</h3>
            </div>
            <p className={styles.featuredDesc}>{activeFeatured.desc || activeFeatured.description}</p>
          </div>
          <div className={styles.featuredRight}>
            <span className={styles.featuredArrow}>→</span>
          </div>
          <span className={styles.featuredGhost}>{activeFeatured.num}</span>
        </motion.div>
      )}

      {/* ── 2-Row Card Grid (5 × 2) ── */}
      <div className={styles.grid}>
        {serviceList.map((svc, i) => (
          <motion.div
            key={svc.id}
            className={styles.card}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: -6 }}
          >
            <span className={styles.ghostNum}>{svc.num}</span>
            <div className={styles.accentLine} />
            <span className={styles.cardIcon}>{svc.icon}</span>
            <p className={styles.cardTitle}>{svc.title}</p>
            <span className={styles.cardArrow}>↗</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
