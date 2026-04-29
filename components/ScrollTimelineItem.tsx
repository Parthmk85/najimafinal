"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollTimelineItemProps {
  children: ReactNode;
  label: string;
}

export default function ScrollTimelineItem({ children, label }: ScrollTimelineItemProps) {
  return (
    <motion.section
      className="timeline-item"
      initial={{ opacity: 0, y: 70, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <span className="timeline-item__node" aria-hidden="true" />
      <div className="timeline-item__label">{label}</div>
      <div className="timeline-item__panel">{children}</div>
    </motion.section>
  );
}