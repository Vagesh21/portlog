import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { skills } from '../data/mockData';

const SkillsRadar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-[#1a1f3a]/50 backdrop-blur-lg border border-[#2a3150] rounded-2xl p-8"
    >
      <h3 className="text-2xl font-bold text-[#e5e7eb] mb-6 text-center">Skills Overview</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={skills}>
          <PolarGrid stroke="#2a3150" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#9ca3af' }}
          />
          <Radar
            name="Skill Level"
            dataKey="level"
            stroke="#00d4ff"
            fill="#00d4ff"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend 
            wrapperStyle={{ color: '#9ca3af' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SkillsRadar;