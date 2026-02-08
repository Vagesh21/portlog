import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { projects } from '../data/mockData';

const ProjectDashboard = () => {
  const getSeverityColor = (score) => {
    if (score >= 90) return 'text-[#10b981]';
    if (score >= 75) return 'text-[#00d4ff]';
    if (score >= 60) return 'text-[#f59e0b]';
    return 'text-[#ef4444]';
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30';
    if (status === 'Active') return 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30';
    return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] hover:border-[#00d4ff]/50 transition-all duration-300 group hover:shadow-lg hover:shadow-[#00d4ff]/10">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#e5e7eb] mb-2 group-hover:text-[#00d4ff] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#9ca3af] mb-2">{project.description}</p>
                  <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                    <Activity size={14} />
                    <span>{project.duration}</span>
                  </div>
                </div>
                <Badge className={`${getStatusColor(project.status)} border`}>
                  {project.status}
                </Badge>
              </div>

              {/* Security Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-[#0a0e27]/50 rounded-lg border border-[#2a3150]">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getSeverityColor(project.metrics.security_score)}`}>
                    {project.metrics.security_score}%
                  </div>
                  <div className="text-xs text-[#6b7280] mt-1 flex items-center justify-center gap-1">
                    <Shield size={12} />
                    Security
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00d4ff]">
                    {project.metrics.vulnerabilities_fixed}
                  </div>
                  <div className="text-xs text-[#6b7280] mt-1 flex items-center justify-center gap-1">
                    <AlertTriangle size={12} />
                    Fixes
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getSeverityColor(project.metrics.performance)}`}>
                    {project.metrics.performance}%
                  </div>
                  <div className="text-xs text-[#6b7280] mt-1 flex items-center justify-center gap-1">
                    <TrendingUp size={12} />
                    Performance
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-xs text-[#9ca3af] mb-1">
                    <span>Security Score</span>
                    <span>{project.metrics.security_score}%</span>
                  </div>
                  <Progress value={project.metrics.security_score} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[#9ca3af] mb-1">
                    <span>Performance</span>
                    <span>{project.metrics.performance}%</span>
                  </div>
                  <Progress value={project.metrics.performance} className="h-2" />
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs bg-[#00d4ff]/10 text-[#00d4ff] rounded-md border border-[#00d4ff]/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Highlights */}
              <div className="border-t border-[#2a3150] pt-4">
                <div className="text-xs font-semibold text-[#9ca3af] mb-2">Key Highlights:</div>
                <ul className="space-y-1">
                  {project.highlights.map((highlight, i) => (
                    <li key={i} className="text-xs text-[#6b7280] flex items-start gap-2">
                      <span className="text-[#00d4ff] mt-0.5">▸</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectDashboard;