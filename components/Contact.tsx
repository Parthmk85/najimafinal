import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';

interface ContactItem {
  icon: string;
  label: string;
  value: string;
  href: string | null;
}

const Contact = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const contactDetails = settings ? [
    settings.contactPhone ? {
      icon: "📞",
      label: "PHONE",
      value: settings.contactPhone,
      href: `tel:${settings.contactPhone.replace(/\s/g, '')}`,
    } : null,
    settings.contactEmail ? {
      icon: "✉️",
      label: "EMAIL",
      value: settings.contactEmail,
      href: `mailto:${settings.contactEmail}`,
    } : null,
    settings.contactAddress ? {
      icon: "📍",
      label: "LOCATION",
      value: settings.contactAddress,
      href: `https://maps.google.com/?q=${encodeURIComponent(settings.contactAddress)}`,
    } : null,
    settings.languages ? {
      icon: "🌐",
      label: "LANGUAGES",
      value: settings.languages,
      href: null,
    } : null,
  ].filter((item): item is ContactItem => item !== null) : [];

  const [formData, setFormData] = useState({
    name: '',
    work: '',
    message: '',
    budget: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // The specific number provided by the user (with country code 91 for India)
    const targetPhone = "917359136176";
    const { name, work, message, budget } = formData;
    
    // Formatting the message as a "lead" as requested
    const whatsappMessage = 
      `*🚀 NEW LEAD RECEIVED*%0A%0A` +
      `*👤 Client:* ${name}%0A` +
      `*🎨 Service/Work:* ${work}%0A` +
      `*💰 Budget:* ${budget || 'Not specified'}%0A` +
      `*📝 Message:* ${message}%0A%0A` +
      `---%0A` +
      `Sent from Portfolio`;
      
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${whatsappMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contact" className={styles.contactContainer}>
      <div className={styles.content}>
        <motion.div
          className={styles.textSide}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className={styles.label}>GET IN TOUCH</p>
          <h2 className={styles.title}>Let&apos;s Create Something Remarkable Together</h2>
          <p className={styles.description}>
            Ready to elevate your digital presence? Whether it&apos;s a social media campaign or a
            high-end video project, I&apos;m here to bring your vision to life.
          </p>

          <div className={styles.infoList}>
            {contactDetails.map((item) => (
              <div className={styles.infoItem} key={item.label}>
                <span className={styles.infoIcon}>{item.icon}</span>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className={styles.infoValue}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className={styles.infoValue}>{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.formSide}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>YOUR NAME</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Enter your name" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>WORK / PROJECT TITLE</label>
              <input 
                type="text" 
                name="work" 
                placeholder="What project are we doing?" 
                value={formData.work}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>ESTIMATED BUDGET</label>
              <input 
                type="text" 
                name="budget" 
                placeholder="Enter your budget (Optional)" 
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>YOUR MESSAGE</label>
              <textarea 
                name="message" 
                placeholder="Tell me about your project in detail" 
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className={styles.submitBtn}>SEND MESSAGE</button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
