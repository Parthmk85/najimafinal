"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createLayout, stagger } from "animejs";
import styles from "./LayoutToggle.module.css";

export default function LayoutToggle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<any>(null);
  const animationRef = useRef<any>(null);

  const images = [
    { id: 1, src: "/to1.jpeg", alt: "Akash Visual 1" },
    { id: 2, src: "/to2.jpeg", alt: "Akash Visual 2" },
    { id: 3, src: "/to3.jpeg", alt: "Akash Visual 3" },
    { id: 4, src: "/to4.jpeg", alt: "Akash Visual 4" },
    { id: 5, src: "/to1.jpeg", alt: "Akash Visual 5" },
    { id: 6, src: "/to2.jpeg", alt: "Akash Visual 6" },
    { id: 7, src: "/to3.jpeg", alt: "Akash Visual 7" },
    { id: 8, src: "/to4.jpeg", alt: "Akash Visual 8" },
    { id: 9, src: "/to1.jpeg", alt: "Akash Visual 9" },
    { id: 10, src: "/to2.jpeg", alt: "Akash Visual 10" },
    { id: 11, src: "/to3.jpeg", alt: "Akash Visual 11" },
    { id: 12, src: "/to4.jpeg", alt: "Akash Visual 12" },
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && containerRef.current) {
      // Initialize AnimeJS Layout
      layoutRef.current = createLayout(containerRef.current);

      let i = 2; // Start from 2 to ensure first update is a change from initial "1"

      const animateLayout = () => {
        if (!layoutRef.current) return;

        return layoutRef.current.update(
          ({ root }: { root: HTMLElement }) => {
            root.dataset.grid = i.toString();
            i = (i % 5) + 1; // Increment for next time (now cycles 1-5)
          },
          {
            duration: 1200,
            delay: stagger(100),
            onComplete: () => {
              animationRef.current = setTimeout(animateLayout, 3500);
            },
          }
        );
      };

      // Start the loop
      animateLayout();
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.labelRow}>
            <span className={styles.labelLine} />
            <span className={styles.labelText}>Dynamic Vision</span>
          </div>
          <div className={styles.statusBadge}>
            <span className={styles.liveDot} />
            <span className={styles.statusText}>AUTO-ANIMATING</span>
          </div>
        </div>

        <div 
          ref={containerRef}
          className={styles.layoutWrapper}
          data-grid="1"
        >
          {images.map((img) => (
            <div
              key={img.id}
              className={styles.imageBox}
              data-id={img.id}
            >
              <div className={styles.imageInner}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className={styles.img}
                  style={{ objectFit: "cover" }}
                  unoptimized={true}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
