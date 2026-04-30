'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Log {
  id: number;
  date: string;
  time: string;
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
      maxWidth: '1000px', 
      padding: '0 20px',
      fontFamily: "'Fira Code', 'Courier New', monospace"
    }}>
      {/* Terminal Header Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: '#2d2d2d', 
          padding: '10px 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: isOpen ? '8px 8px 0 0' : '8px',
          border: '1px solid #444',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
          <span style={{ marginLeft: '10px', color: '#aaa', fontSize: '12px', fontWeight: 600 }}>najimafinal ~ system-logs</span>
        </div>
        <div style={{ color: '#00ff00', fontSize: '12px' }}>
          {isOpen ? '-- MINIMIZE' : '-- EXPAND'}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ 
              background: '#1e1e1e', 
              border: '1px solid #444', 
              borderTop: 'none',
              padding: '20px',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}
          >
            {/* Environment Stats */}
            <div style={{ marginBottom: '20px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
              <div style={{ color: '#569cd6', fontSize: '13px', marginBottom: '8px' }}>// System Environment Status</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12px' }}>
                <div style={{ color: '#dcdcdc' }}>DB_CONN: <span style={{ color: '#4ade80' }}>{data.database.connection.toUpperCase()}</span></div>
                <div style={{ color: '#dcdcdc' }}>DB_NAME: <span style={{ color: '#ce9178' }}>"{data.database.name}"</span></div>
                <div style={{ color: '#dcdcdc' }}>STORAGE: <span style={{ color: '#ce9178' }}>"{data.storage.type}"</span></div>
                <div style={{ color: '#dcdcdc' }}>SYNC: <span style={{ color: '#4ade80' }}>ACTIVE</span></div>
              </div>
            </div>

            {/* Logs Content */}
            <div style={{ color: '#dcdcdc', fontSize: '13px', lineHeight: '1.6' }}>
              <div style={{ color: '#888', marginBottom: '10px' }}>[Initializing log stream...]</div>
              {data.recentLogs.map((log, index) => (
                <div key={log.id} style={{ marginBottom: '6px', display: 'flex', gap: '12px' }}>
                  <span style={{ color: '#888' }}>[{log.date} {log.time}]</span>
                  <span style={{ 
                    color: log.type === 'Backend' ? '#569cd6' : 
                           log.type === 'Database' ? '#4ade80' : 
                           log.type === 'Storage' ? '#ce9178' : '#b5cea8',
                    minWidth: '70px',
                    fontWeight: 700
                  }}>{log.type.toUpperCase()}</span>
                  <span style={{ color: '#eee' }}>{log.message}</span>
                </div>
              ))}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#00ff00' }}>$</span>
                <motion.div 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ width: '8px', height: '15px', background: '#00ff00' }} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemLogs;
