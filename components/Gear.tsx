import React, { useState, useEffect } from "react";

import { motion, type Variants } from "framer-motion";
import styles from "./Gear.module.css";

const RupeeIcon = (
  <span style={{ fontSize: '2rem', fontWeight: 600, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    ₹
  </span>
);

const icons: Record<string, React.ReactNode> = {
  bridal: RupeeIcon,
  engagement: RupeeIcon,
  regular: RupeeIcon,
  festival: RupeeIcon,
};

const defaultIcon = RupeeIcon;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Gear() {
  const [gearList, setGearList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/gear")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(item => ({
            ...item,
            icon: icons[item.icon] || defaultIcon,
          }));
          setGearList(mapped);
        } else {
          setGearList([]);
        }
      })
      .catch(() => setGearList([]));
  }, []);

  if (gearList.length === 0) return null;

  return (
    <section id="pricing" className={styles.section}>
      {/* Label */}
      <div className={styles.labelRow}>
        <span className={styles.labelLine} />
        <span className={styles.labelText}>Packages & Rates</span>
        <span className={styles.labelLine} />
      </div>

      {/* Heading */}
      <h2 className={styles.heading}>Pricing</h2>

      {/* Cards */}
      <motion.div
        className={styles.grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {gearList.map((item, i) => (
          <motion.div
            key={item._id || item.id || i}
            className={styles.card}
            variants={cardVariants}
            custom={i}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
          >
            <div className={styles.iconWrap}>{item.icon}</div>
            <div className={styles.cardBody}>
              <span className={styles.subtitle}>{item.subtitle}</span>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.desc}>{item.description}</p>
              <div className={styles.priceList}>
                {(item.tags || []).map((tag: string) => (
                  <div key={tag} className={styles.priceItem}>
                    <span className={styles.dot} />
                    <span className={styles.priceLabel}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.cardAccent} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
