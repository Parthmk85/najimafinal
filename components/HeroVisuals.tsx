"use client"

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

interface HeroVisualsProps {
  scrollYProgress: MotionValue<number>;
  heroImage?: string;
}

export default function HeroVisuals({ scrollYProgress, heroImage }: HeroVisualsProps) {
  const heroParallax = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const frame2Y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div className="hero-right">
      <motion.div className="hero-img-wrap layer-main" style={{ y: heroParallax }}>
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Akash Portrait"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 5%' }}
            priority
            unoptimized
          />
        ) : (
          <div
            aria-label="Hero image placeholder"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(176,125,98,0.22), rgba(255,255,255,0.06))',
              borderLeft: '1px solid rgba(176,125,98,0.18)'
            }}
          />
        )}
      </motion.div>
      {heroImage && (
        <motion.div className="hero-img-accent frame-2" style={{ y: frame2Y }}>
          <Image src={heroImage} alt="Frame 2" fill style={{ objectFit: 'cover' }} unoptimized />
        </motion.div>
      )}
      <div className="img-fade-left"></div>
      <div className="img-fade-bottom"></div>
    </div>
  );
}
