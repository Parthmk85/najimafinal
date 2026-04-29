"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './MyCourse.module.css';

interface Course {
  _id: string;
  title: string;
  image: string;
}

const MyCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        }
      })
      .catch(() => setCourses([]));
  }, []);

  if (courses.length === 0) return null;

  return (
    <section id="courses" className={styles.courseContainer}>
      <div className={styles.header}>
        <div className={styles.labelRow}>
          <span className={styles.labelLine} />
          <p className={styles.label}>LEARN THE ART</p>
          <span className={styles.labelLine} />
        </div>
        <h2 className={styles.title}>My Courses</h2>
      </div>

      <div className={styles.grid}>
        {courses.map((course, i) => (
          <motion.div
            key={course._id}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className={styles.imageWrapper}>
              <Image 
                src={course.image} 
                alt={course.title} 
                fill 
                className={styles.image}
                unoptimized
              />
              <div className={styles.overlay}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MyCourse;
