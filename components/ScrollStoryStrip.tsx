"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import styles from "./ScrollStoryStrip.module.css";

interface ScrollStoryStripProps {
  scrollYProgress: MotionValue<number>;
}

export default function ScrollStoryStrip({ scrollYProgress }: ScrollStoryStripProps) {
  const leftCardX = useTransform(scrollYProgress, [0.02, 0.16], [-120, 0]);
  const rightCardX = useTransform(scrollYProgress, [0.02, 0.16], [120, 0]);
  const centerCardY = useTransform(scrollYProgress, [0.04, 0.18], [60, 0]);
  const stripOpacity = useTransform(scrollYProgress, [0.01, 0.08, 0.22], [0.35, 1, 1]);

  return (
    <section id="story" className={styles.section}>
      <motion.div className={styles.shell} style={{ opacity: stripOpacity }}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Scroll Activated Story Mode</p>
          <h2 className={styles.title}>One page. One flow. Everything unlocks as the page moves.</h2>
          <p className={styles.copy}>
            This website now behaves like a full scroll journey, where each block enters in sequence instead of loading as disconnected screens.
          </p>
        </div>

        <div className={styles.cardGrid}>
          <motion.article className={styles.card} style={{ x: leftCardX }}>
            <span className={styles.cardIndex}>01</span>
            <h3>Discovery on scroll</h3>
            <p>Visitors start from the hero and naturally drop into services, work, proof and contact without route changes.</p>
          </motion.article>

          <motion.article className={`${styles.card} ${styles.featuredCard}`} style={{ y: centerCardY }}>
            <span className={styles.cardIndex}>02</span>
            <h3>Sections behave like scenes</h3>
            <p>Timeline reveals, sticky navigation hints and live scroll status turn each component into a single-page cinematic chapter.</p>
          </motion.article>

          <motion.article className={styles.card} style={{ x: rightCardX }}>
            <span className={styles.cardIndex}>03</span>
            <h3>Scrolling becomes the interaction</h3>
            <p>Progress tracking, section docking and flowing transitions only make sense while the user is moving through the page.</p>
          </motion.article>
        </div>
      </motion.div>
    </section>
  );
}