"use client";

import { AnimatePresence, motion } from "framer-motion";

interface SplashScreenProps {
  visible: boolean;
  onSkip: () => void;
}

export default function SplashScreen({ visible, onSkip }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          <motion.div
            className="splash-screen__content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <h1 className="splash-screen__title">
              <span>Najima</span>
              <span>Mehandi Artist</span>
            </h1>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}