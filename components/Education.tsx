import React, { useState, useEffect } from "react";

import { motion, type Variants } from "framer-motion";
import styles from "./Education.module.css";

// Premium SVG icons for Education
const icons = {
  graduation: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  book: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  university: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  calendar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Education() {
  const [degreeList, setDegreeList] = useState<any[]>([]);
  const [eduMeta, setEduMeta] = useState<{ name: string; short: string; location: string } | null>(null);

  useEffect(() => {
    fetch("/api/education")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          setEduMeta({
            name: first.schoolName,
            short: first.schoolShort,
            location: first.location
          });
          const mapped = data.map((d: any) => ({
            ...d,
            icon: (icons as any)[d.icon] || icons.graduation
          }));
          setDegreeList(mapped);
        } else {
          setDegreeList([]);
          setEduMeta(null);
        }
      })
      .catch(() => { setDegreeList([]); setEduMeta(null); });
  }, []);

  if (degreeList.length === 0) return null;

  return (
    <section id="education" className={styles.section}>
      {/* Label */}
      <div className={styles.labelRow}>
        <span className={styles.labelLine} />
        <span className={styles.labelText}>Course Details</span>
        <span className={styles.labelLine} />
      </div>

      <h2 className={styles.heading}>Course</h2>

      {/* University badge */}
      {eduMeta && (
        <motion.div
          className={styles.uniBadge}
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.uniIcon}>{icons.university}</span>
          <div>
            <p className={styles.uniName}>{eduMeta.name}</p>
            <p className={styles.uniMeta}>{eduMeta.short} · {eduMeta.location}</p>
          </div>
        </motion.div>
      )}

      {/* Degree cards */}
      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {degreeList.map((d) => (
          <motion.div key={d.id} className={styles.card} variants={cardVariants}>
            <div className={styles.cardTop}>
              <span className={styles.degIcon}>{d.icon}</span>
              {d.status && (
                <span className={`${styles.badge} ${styles[d.statusType]}`}>
                  {d.status}
                </span>
              )}
            </div>

            <p className={styles.degShort}>{d.short}</p>
            <h3 className={styles.degTitle}>{d.degree}</h3>

            <div className={styles.cardFooter}>
              <span className={styles.yearPill}>
                <span className={styles.calIcon}>{icons.calendar}</span>
                {d.year}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
