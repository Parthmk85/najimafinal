"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Projects", href: "#portfolio" },
    { name: "Skills", href: "#about" },
    { name: "Course", href: "#education" },
    { name: "Pricing", href: "#pricing" },
    { name: "Feedback", href: "#feedback" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ["home", "portfolio", "about", "education", "pricing", "feedback"];
      const current = sections.find(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      
      if (current) {
        const nameMap: Record<string, string> = { 
          home: "Home", 
          portfolio: "Projects", 
          about: "Skills",
          education: "Course",
          pricing: "Pricing",
          feedback: "Feedback"
        };
        setActiveSection(nameMap[current]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className={`${styles.navbarContainer} ${isScrolled ? styles.scrolled : ""}`}>
        {!isMobile ? (
          <motion.nav 
            className={styles.pill}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.name;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                  onClick={() => setActiveSection(link.name)}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="activePill"
                      className={styles.activeHighlight}
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
            
            <Link href="/admin" className={`${styles.navLink} ${styles.adminLink}`}>
              <span className={styles.adminDot} aria-hidden="true" />
              Admin
            </Link>

            <a href="#about" className={styles.hireMeBtn}>
              Hire Me
            </a>
          </motion.nav>
        ) : (
          <div className={styles.mobileFloatingToggle}>
            <button className={styles.hamburgerBtn} onClick={toggleMenu} aria-label="Toggle Menu">
              <div className={`${styles.bar} ${isMenuOpen ? styles.barActive : ""}`} />
              <div className={`${styles.bar} ${isMenuOpen ? styles.barActive : ""}`} />
              <div className={`${styles.bar} ${isMenuOpen ? styles.barActive : ""}`} />
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <>
            <motion.div 
              className={styles.menuOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />
            <motion.div 
              className={styles.mobileDrawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className={styles.drawerHeader}>
                <span className={styles.drawerTitle}>MENU</span>
                <button className={styles.closeBtn} onClick={toggleMenu}>&times;</button>
              </div>
              <div className={styles.drawerLinks}>
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={styles.drawerLink}
                    onClick={() => {
                      setActiveSection(link.name);
                      toggleMenu();
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link href="/admin" className={styles.drawerLink} onClick={toggleMenu}>
                  Admin Panel
                </Link>
              </div>
              <a href="#about" className={styles.drawerHireBtn} onClick={toggleMenu}>
                Hire Me Now
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
