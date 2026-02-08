import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2 } from 'lucide-react';
import { certifications } from '../data/mockData';
import { Badge } from './ui/badge';

const CertificationGallery = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {certifications.map((cert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          viewport={{ once: true }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-[#1a1f3a]/50 backdrop-blur-lg border border-[#2a3150] rounded-xl p-6 hover:border-[#00d4ff]/50 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex flex-col h-full">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${cert.color}20`, border: `1px solid ${cert.color}40` }}
            >
              <Award size={24} style={{ color: cert.color }} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h4 className="text-[#e5e7eb] font-semibold mb-2 text-sm leading-tight group-hover:text-[#00d4ff] transition-colors">
                {cert.name}
              </h4>
              <p className="text-[#9ca3af] text-xs mb-3">{cert.issuer}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2a3150]">
              <span className="text-[#6b7280] text-xs">{cert.year}</span>
              {cert.verified && (
                <Badge className="bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30 border text-xs flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CertificationGallery;