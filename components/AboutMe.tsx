"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './AboutMe.module.css';

const icons = {
  strategy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 8v8"/>
    </svg>
  ),
  production: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  ),
  creative: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v8"/><path d="m4.93 4.93 5.66 5.66"/><path d="M2 12h8"/><path d="m4.93 19.07 5.66-5.66"/><path d="M12 22v-8"/><path d="m19.07 19.07-5.66-5.66"/><path d="M22 12h-8"/><path d="m19.07 4.93-5.66 5.66"/>
    </svg>
  )
};

type IconKey = keyof typeof icons;

interface Skill {
  _id: string;
  title: string;
  image: string;
}

const AboutMe = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [aboutImage, setAboutImage] = useState<string>('');

  useEffect(() => {
    fetch('/api/skills')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSkills(data);
        }
      })
      .catch(() => setSkills([]));
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { if (data?.aboutImage) setAboutImage(data.aboutImage); })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className={styles.aboutContainer}>
      <div className={styles.stickyFrame}>
        <div className={styles.content}>
          <motion.div
            className={styles.imageWrapper}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className={styles.imageOverlay}></div>
            {aboutImage ? (
              <Image
                src={aboutImage}
                alt="Akash Official Profile"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.aboutImage}
                style={{ objectFit: 'cover' }}
                priority
                unoptimized
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#e8d9ca' }} />
            )}
          </motion.div>

          <div className={styles.textWrapper}>
            <div className={styles.skillsSection}>
              <div className={styles.rowHeading}>
                <span className={styles.headingLine} />
                <h2 className={styles.skillsHeading}>Some of my expertise</h2>
                <span className={styles.headingLine} />
              </div>

              <div className={styles.cardStage}>
                {skills.map((skill, i) => (
                  <motion.div
                    key={skill._id}
                    className={styles.skillCardSmall}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <div className={styles.skillIconWrapper}>
                      <Image 
                        src={skill.image} 
                        alt={skill.title} 
                        fill 
                        className={styles.skillIconImg}
                        unoptimized
                      />
                    </div>
                    <h4 className={styles.skillTitleSmall}>{skill.title}</h4>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={styles.action} style={{ marginTop: '1.5rem' }}>
              <a href="#contact" className={styles.contactBtn}>Contact Me</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
