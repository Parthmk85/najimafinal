"use client";

import { motion, AnimatePresence, MotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./ScrollPageChrome.module.css";

export interface SinglePageSection {
  id: string;
  label: string;
  shortLabel: string;
}

interface ScrollPageChromeProps {
  scrollYProgress: MotionValue<number>;
  sections: SinglePageSection[];
}

export default function ScrollPageChrome({ scrollYProgress, sections }: ScrollPageChromeProps) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "home");
  const [progressLabel, setProgressLabel] = useState("0%");

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgressLabel(`${Math.round(value * 100)}%`);
  });

  useEffect(() => {
    // Use scroll position to find which section is most visible
    const handleScroll = () => {
      let bestId = sections[0]?.id ?? "home";
      let minDistance = Infinity;

      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // Distance from the vertical center of the element to the vertical center of the viewport
        const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        
        if (distance < minDistance) {
          minDistance = distance;
          bestId = section.id;
        }
      });

      setActiveSectionId(bestId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleDotClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  const dotProgressTheme = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <aside className={styles.singleLineDock} aria-label="Single page section navigation">
        <div className={styles.trackLine}>
          <motion.div 
            className={styles.movingDot} 
            style={{ top: dotProgressTheme }} 
          />
        </div>

        <div className={styles.clickOverlay}>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={styles.hiddenClickArea}
              onClick={(e) => handleDotClick(e, section.id)}
              title={section.label}
            />
          ))}
        </div>
      </aside>

      <motion.div
        className={styles.scrollBadge}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        <span className={styles.progressValue}>{progressLabel}</span>
        <div>
          <p className={styles.badgeLabel}>Single Page Flow</p>
          <strong className={styles.badgeSection}>{activeSection?.label}</strong>
        </div>
      </motion.div>
    </>
  );
}