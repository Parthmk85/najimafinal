'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Log {
  id: number;
  date: string;
  type: string;
  message: string;
}

interface StatusData {
  status: string;
  database: { name: string; connection: string };
  storage: { type: string; path: string; sync: string };
  recentLogs: Log[];
}

const SystemLogs = () => {
  const [data, setData] = useState<StatusData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div style={{ 
      margin: '4rem auto', 
      maxWidth: '1200px', 
      padding: '0 20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: '#000', 
          color: '#fff', 
          padding: '1rem 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: '4px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: data.database.connection === 'Connected' ? '#4ade80' : '#f87171' 
          }} />
          <span style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.1em' }}>SYSTEM DEVELOPMENT LOGS</span>
        </div>
        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{isOpen ? '[ CLOSE ]' : '[ VIEW UPDATES ]'}</span>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: '#fff', 
            border: '1px solid #000', 
            borderTop: 'none',
            padding: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Status Panel */}
          <div>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.65rem', fontWeight: 900, color: '#888', letterSpacing: '0.1em' }}>ENVIRONMENT</h4>
            <div style={{ display: 'grid', gap: '0.8rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Database:</span>
                <span style={{ fontWeight: 700 }}>{data.database.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Connection:</span>
                <span style={{ fontWeight: 700, color: '#4ade80' }}>{data.database.connection}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Storage:</span>
                <span style={{ fontWeight: 700 }}>{data.storage.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Asset Sync:</span>
                <span style={{ fontWeight: 700 }}>{data.storage.sync}</span>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div style={{ gridColumn: 'span 2' }}>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.65rem', fontWeight: 900, color: '#888', letterSpacing: '0.1em' }}>RECENT ACTIVITY</h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {data.recentLogs.map(log => (
                <div key={log.id} style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  fontSize: '0.8rem', 
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #f5f5f5'
                }}>
                  <span style={{ color: '#aaa', minWidth: '80px' }}>{log.date}</span>
                  <span style={{ 
                    background: '#f0f0f0', 
                    padding: '0.1rem 0.4rem', 
                    fontSize: '0.6rem', 
                    fontWeight: 900,
                    borderRadius: '2px',
                    height: 'fit-content'
                  }}>{log.type}</span>
                  <span style={{ color: '#333' }}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SystemLogs;
