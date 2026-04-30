"use client"
import { useState, useEffect } from "react";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import SplashScreen from "@/components/SplashScreen";

// Dynamically import client components to prevent SSR/Hydration issues
const PortfolioSection = dynamic(() => import("@/components/PortfolioSection"), { ssr: false });
const AboutMe = dynamic(() => import("@/components/AboutMe"), { ssr: false });
const Services = dynamic(() => import("@/components/Services"), { ssr: false });
const Education = dynamic(() => import("@/components/Education"), { ssr: false });
const MyCourse = dynamic(() => import("@/components/MyCourse"), { ssr: false });
const Gear = dynamic(() => import("@/components/Gear"), { ssr: false });
const Feedback = dynamic(() => import("@/components/Feedback"), { ssr: false });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: false });
const SystemLogs = dynamic(() => import("@/components/SystemLogs"), { ssr: false });


interface HeroSocial {
  platform: string;
  url: string;
}

interface HomeSettings {
  heroSubTitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  socials?: HeroSocial[];
  contactPhone?: string;
}

export default function Home() {
  const [settings, setSettings] = useState<HomeSettings | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const titleParts = (settings?.heroTitle?.trim() || "Najima Mehndi Artist").split(/\s+/).filter(Boolean);
  const scriptTitle = titleParts[0] || "Najima";
  const blockTitle = (titleParts.slice(1).join(" ") || "Mehndi Artist").toUpperCase();
  const rawHandle = settings?.heroSubTitle?.trim() || "@najima_mehndi_artist";
  const heroHandle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;
  const heroTagline = settings?.heroDescription?.trim() || "Make Your Special Day More Beautiful with Artistic Mehndi";
  const heroImageUrl = settings?.heroImage || "/to3.jpeg";
  const phoneLabel = settings?.contactPhone?.trim() || "73591 36176";
  const phoneDigits = phoneLabel.replace(/\D/g, "");
  const phoneLink = phoneDigits ? `tel:${phoneDigits}` : "#contact";
  const whatsappLink =
    settings?.socials?.find((social) => /whatsapp/i.test(social.platform))?.url || "https://wa.me/917359136176";

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) setSettings(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2000);
    document.body.classList.toggle("splash-active", showSplash);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("splash-active");
    };
  }, [showSplash]);

  useEffect(() => {
    if (showSplash) return;

    const selectors = [
      ".najima-hero-brand",
      ".najima-title-script",
      ".najima-title-main",
      ".najima-hero-handle",
      ".najima-hero-tagline",
      ".najima-media-stage",
      ".najima-booking-card",
      ".timeline-item__label",
      ".aboutContainer .skillCardSingle",
      ".section .featuredCard",
      ".section .grid > *",
      ".portfolioContainer .header",
      ".feedbackContainer .header",
      ".feedbackContainer .card",
      ".contactContainer .infoItem",
      ".contactContainer .inputGroup",
      ".contactContainer .submitBtn",
    ];

    const elements = selectors
      .flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)))
      .filter((element, index, arr) => arr.indexOf(element) === index);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elements.forEach((element, index) => {
      if (!element.classList.contains("reveal-on-scroll")) {
        element.classList.add("reveal-on-scroll");
      }
      element.style.setProperty("--reveal-delay", `${Math.min((index % 8) * 70, 490)}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [showSplash, settings]);

  return (
    <div className="mehndi-page-root flex flex-col min-h-screen" style={{ overflowX: 'hidden' }}>
      <div className="mehndi-page-graffiti" aria-hidden="true" />
      <div className="mehndi-page-content">
        <div className="najima-corner-flourish corner-top-left">
          <Image src="/portfolio/New folder/mehndi-flourish-removebg-preview.png" alt="" width={320} height={320} />
        </div>
        <div className="najima-corner-flourish corner-top-right">
          <Image src="/portfolio/New folder/mehndi-flourish-removebg-preview.png" alt="" width={320} height={320} />
        </div>
        <SplashScreen visible={showSplash} onSkip={() => setShowSplash(false)} />
        <Navbar />

        {!showSplash ? (
          <motion.main
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
          {/* ── HERO SECTION ─────────────────────────────────── */}
          <section id="home" className="najima-hero">
            <div className="najima-hero-card">
              <div className="najima-hero-shell">
                <div className="najima-hero-heading-wrap">
                  <motion.span
                    className="najima-title-script"
                    initial={{ opacity: 0, y: 25, rotate: -2 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {scriptTitle}
                  </motion.span>
                  <motion.h1
                    className="najima-title-main"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.3, 
                      duration: 1, 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 20 
                    }}
                  >
                    <span className="najima-word-mehndi">MEHNDI</span>
                    <span className="najima-word-artist">ARTIST</span>
                  </motion.h1>
                </div>

                <motion.p
                  className="najima-hero-tagline"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.8 }}
                >
                  {heroTagline}
                </motion.p>

                <motion.div
                  className="najima-media-stage"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Decorative Flourishes */}
                  <div className="najima-stage-flourish flourish-left">
                    <Image src="/portfolio/New folder/mehndi-flourish-removebg-preview.png" alt="" width={400} height={400} />
                  </div>
                  <div className="najima-stage-flourish flourish-right">
                    <Image src="/portfolio/New folder/mehndi-flourish-removebg-preview.png" alt="" width={400} height={400} />
                  </div>

                  <div className="najima-main-image">
                    <Image
                      src={heroImageUrl}
                      alt="Artist's Work"
                      fill
                      className="najima-main-photo"
                      priority
                    />
                  </div>

                  <div className="najima-booking-card">
                    <p className="najima-booking-title">Book Your Appointment Now</p>
                    <div className="najima-booking-grid">
                      <a href={phoneLink} className="najima-booking-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        <span>{phoneLabel}</span>
                      </a>
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="najima-booking-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                        <span>WhatsApp Inquiry</span>
                      </a>
                    </div>
                    <a href="#contact" className="najima-booking-cta">
                      Secure Your Date
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

            <PortfolioSection />
            <AboutMe />
            <MyCourse />
            <Education />
            <Gear />
            <section id="feedback">
              <Feedback />
            </section>
            <Contact />
            <SystemLogs />
          </motion.main>
        ) : null}

        <footer className="footer-note"></footer>
      </div>
    </div>
  );
}
