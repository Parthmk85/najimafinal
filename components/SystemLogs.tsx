'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Log {
  id: number;
  type: string;
  message: string;
}

interface StatusData {
  cwd: string;
  database: { name: string; connection: string };
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
      maxWidth: '1100px', 
      padding: '0 20px',
      fontFamily: "Consolas, 'Courier New', monospace"
    }}>
      {/* Windows Command Prompt Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: '#fff', 
          color: '#000', 
          padding: '4px 12px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: isOpen ? '4px 4px 0 0' : '4px',
          border: '1px solid #ccc',
          fontSize: '12px',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="https://www.google.com/s2/favicons?domain=microsoft.com" alt="" style={{ width: '14px' }} />
          <span>Command Prompt - npm run dev</span>
        </div>
        <div style={{ display: 'flex', gap: '15px', fontSize: '14px' }}>
          <span>_</span>
          <span>▢</span>
          <span style={{ color: '#ff0000' }}>X</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ 
              background: '#0c0c0c', 
              color: '#cccccc',
              padding: '15px',
              borderRadius: '0 0 4px 4px',
              overflow: 'hidden',
              fontSize: '14px',
              lineHeight: '1.4',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              border: '1px solid #333',
              borderTop: 'none'
            }}
          >
            {/* Windows OS Header */}
            <div style={{ color: '#aaa', marginBottom: '15px' }}>
              Microsoft Windows [Version 10.0.19045.5487]<br />
              (c) Microsoft Corporation. All rights reserved.
            </div>

            <div style={{ marginBottom: '15px' }}>
              {data.cwd}&gt; npm run dev<br />
              <br />
              &gt; akash@0.1.0 dev<br />
              &gt; next dev<br />
            </div>

            {/* Simulated Next.js Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {data.recentLogs.map((log) => {
                let color = '#cccccc';
                if (log.message.includes('▲')) color = '#ffffff';
                if (log.message.includes('✓')) color = '#4ade80';
                if (log.message.includes('⨯')) color = '#ff5f56';
                if (log.message.includes('⚠')) color = '#ffbd2e';
                if (log.message.includes('○')) color = '#569cd6';
                if (log.message.includes('[DB]')) color = '#f59e0b';

                return (
                  <div key={log.id} style={{ color }}>
                    {log.message}
                  </div>
                );
              })}
            </div>

            {/* Blinking Cursor Prompt */}
            <div style={{ marginTop: '15px', display: 'flex', gap: '4px' }}>
              <span>{data.cwd}&gt;</span>
              <motion.div 
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ width: '8px', height: '18px', background: '#ccc' }} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemLogs;
