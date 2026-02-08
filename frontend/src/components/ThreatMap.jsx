import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Radio } from 'lucide-react';
import { threatMapData } from '../data/mockData';

const ThreatMap = () => {
  const [activeThreats, setActiveThreats] = useState([]);

  useEffect(() => {
    // Simulate real-time threat updates
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * threatMapData.length);
      setActiveThreats(prev => {
        const newThreats = [threatMapData[randomIndex], ...prev].slice(0, 5);
        return newThreats;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#00d4ff';
      case 'low': return '#10b981';
      default: return '#9ca3af';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-[#1a1f3a]/50 backdrop-blur-lg border border-[#2a3150] rounded-2xl p-8 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-[#e5e7eb] flex items-center gap-2">
          <Radio className="text-[#00d4ff] animate-pulse" size={24} />
          Live Threat Monitor
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#10b981]">
          <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>
          <span>Live</span>
        </div>
      </div>

      {/* World Map Visualization */}
      <div className="relative h-64 mb-6 bg-[#0a0e27]/50 rounded-lg border border-[#2a3150] overflow-hidden">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Simple world map silhouette */}
          <path
            d="M 100 250 Q 150 200 250 220 T 400 250 Q 500 280 600 250 T 800 220 Q 850 240 900 250"
            fill="none"
            stroke="#2a3150"
            strokeWidth="2"
          />
          <path
            d="M 100 300 Q 200 320 300 300 T 500 320 Q 650 300 750 310 T 900 300"
            fill="none"
            stroke="#2a3150"
            strokeWidth="2"
          />
          
          {/* Threat points */}
          {threatMapData.map((threat, index) => {
            const x = (threat.lng + 180) * (1000 / 360);
            const y = (90 - threat.lat) * (500 / 180);
            
            return (
              <g key={threat.id}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={getSeverityColor(threat.severity)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
                <motion.circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke={getSeverityColor(threat.severity)}
                  strokeWidth="1"
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, delay: index * 0.1 }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Threat Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['critical', 'high', 'medium', 'low'].map((severity) => {
          const count = threatMapData.filter(t => t.severity === severity).length;
          return (
            <div
              key={severity}
              className="bg-[#0a0e27]/50 rounded-lg p-3 border border-[#2a3150]"
            >
              <div className="text-xs text-[#9ca3af] mb-1 capitalize">{severity}</div>
              <div className="text-2xl font-bold" style={{ color: getSeverityColor(severity) }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Threats */}
      <div>
        <div className="text-sm font-semibold text-[#9ca3af] mb-3">Recent Activity</div>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {activeThreats.length === 0 ? (
            <div className="text-center text-[#6b7280] py-8">Monitoring for threats...</div>
          ) : (
            activeThreats.map((threat, index) => (
              <motion.div
                key={`${threat.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-[#0a0e27]/30 rounded-lg border border-[#2a3150]"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} style={{ color: getSeverityColor(threat.severity) }} />
                  <div>
                    <div className="text-sm text-[#e5e7eb]">{threat.country}</div>
                    <div className="text-xs text-[#6b7280]">{threat.threats} threats detected</div>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded capitalize"
                  style={{
                    backgroundColor: `${getSeverityColor(threat.severity)}20`,
                    color: getSeverityColor(threat.severity),
                    border: `1px solid ${getSeverityColor(threat.severity)}40`
                  }}
                >
                  {threat.severity}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatMap;