import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, MapPin, Code, Server, Shield, Award as AwardIcon, TrendingUp } from 'lucide-react';
import FloatingNav from './components/FloatingNav';
import Hero3D from './components/Hero3D';
import InteractiveAvatar from './components/InteractiveAvatar';
import SkillsRadar from './components/SkillsRadar';
import ProjectDashboard from './components/ProjectDashboard';
import ThreatMap from './components/ThreatMap';
import CertificationGallery from './components/CertificationGallery';
import ContactForm from './components/ContactForm';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from './components/ui/toaster';
import { personalInfo, stats, experience, education } from './data/mockData';
import { trackPageView } from './utils/analytics';

const HomePage = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const fullText = personalInfo.title;
  const location = useLocation();

  // Track page view on mount and route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [fullText]);

  // Animated counter for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex(prev => (prev + 1) % Object.keys(stats).length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0e27] min-h-screen text-[#e5e7eb]">
      <FloatingNav />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Hero3D />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                className="w-32 h-32 rounded-full border-4 border-[#00d4ff] shadow-lg shadow-[#00d4ff]/50"
              />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] via-[#06b6d4] to-[#10b981] bg-clip-text text-transparent">
              {personalInfo.name}
            </h1>
            
            <div className="h-12 mb-6">
              <p className="text-2xl md:text-3xl text-[#9ca3af] font-mono">
                {displayedText}
                <span className="animate-pulse">|</span>
              </p>
            </div>
            
            <p className="text-lg text-[#9ca3af] max-w-2xl mx-auto mb-8">
              {personalInfo.subtitle}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {[
                { label: 'Projects', value: stats.projectsCompleted, icon: Code },
                { label: 'Certifications', value: stats.certificationsEarned, icon: AwardIcon },
                { label: 'Vulnerabilities Fixed', value: stats.vulnerabilitiesFixed, icon: Shield },
                { label: 'Security Score', value: `${stats.securityScore}%`, icon: TrendingUp }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-[#1a1f3a]/50 backdrop-blur-lg border border-[#2a3150] rounded-lg p-4 hover:border-[#00d4ff]/50 transition-all"
                  >
                    <Icon className="text-[#00d4ff] mx-auto mb-2" size={24} />
                    <div className="text-2xl font-bold text-[#e5e7eb]">{stat.value}</div>
                    <div className="text-xs text-[#9ca3af]">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-4 text-sm"
            >
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-[#9ca3af] hover:text-[#00d4ff] transition-colors">
                <Mail size={16} />
                {personalInfo.email}
              </a>
              <span className="flex items-center gap-2 text-[#9ca3af]">
                <Phone size={16} />
                {personalInfo.phone}
              </span>
              <span className="flex items-center gap-2 text-[#9ca3af]">
                <MapPin size={16} />
                {personalInfo.location}
              </span>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex justify-center gap-4 mt-6"
            >
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#1a1f3a]/50 rounded-full border border-[#2a3150] hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all"
              >
                <Github size={20} />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#1a1f3a]/50 rounded-full border border-[#2a3150] hover:border-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all"
              >
                <Linkedin size={20} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#e5e7eb] mb-12 text-center flex items-center justify-center gap-3">
              <Server className="text-[#00d4ff]" />
              About Me
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Bio */}
              <div className="bg-[#1a1f3a]/50 backdrop-blur-lg border border-[#2a3150] rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#e5e7eb] mb-4">Background</h3>
                <p className="text-[#9ca3af] leading-relaxed mb-6">
                  {personalInfo.bio}
                </p>
                
                {/* Education */}
                <h4 className="text-lg font-semibold text-[#00d4ff] mb-3">Education</h4>
                <div className="space-y-3">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-[#00d4ff] pl-4">
                      <div className="text-[#e5e7eb] font-semibold">{edu.degree}</div>
                      <div className="text-sm text-[#9ca3af]">{edu.institution}</div>
                      <div className="text-xs text-[#6b7280]">
                        {edu.current ? `Expected: ${edu.expected}` : `Completed: ${edu.completed}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-[#1a1f3a]/50 backdrop-blur-lg border border-[#2a3150] rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-[#e5e7eb] mb-4">Experience</h3>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-[#10b981] pl-4">
                      <div className="text-[#e5e7eb] font-semibold">{exp.title}</div>
                      <div className="text-sm text-[#00d4ff]">{exp.company}</div>
                      <div className="text-xs text-[#6b7280] mb-2">{exp.duration}</div>
                      <p className="text-sm text-[#9ca3af] mb-2">{exp.description}</p>
                      <ul className="space-y-1">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="text-xs text-[#6b7280] flex items-start gap-2">
                            <span className="text-[#10b981] mt-0.5">▸</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills Radar */}
            <SkillsRadar />
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-[#131829]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#e5e7eb] mb-4 text-center flex items-center justify-center gap-3">
              <Code className="text-[#00d4ff]" />
              Security Projects
            </h2>
            <p className="text-[#9ca3af] text-center mb-12 max-w-2xl mx-auto">
              Interactive dashboard showcasing cybersecurity projects with real-time metrics and performance indicators
            </p>
            <ProjectDashboard />
          </motion.div>
        </div>
      </section>

      {/* Threat Map Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#e5e7eb] mb-4 text-center flex items-center justify-center gap-3">
              <Shield className="text-[#00d4ff]" />
              Global Threat Monitor
            </h2>
            <p className="text-[#9ca3af] text-center mb-12 max-w-2xl mx-auto">
              Live simulation of global cybersecurity threats and attack patterns
            </p>
            <ThreatMap />
          </motion.div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 px-6 bg-[#131829]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#e5e7eb] mb-4 text-center flex items-center justify-center gap-3">
              <AwardIcon className="text-[#00d4ff]" />
              Certifications & Achievements
            </h2>
            <p className="text-[#9ca3af] text-center mb-12 max-w-2xl mx-auto">
              Professional certifications and credentials in cybersecurity and related technologies
            </p>
            <CertificationGallery />
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#e5e7eb] mb-4 text-center flex items-center justify-center gap-3">
              <Mail className="text-[#00d4ff]" />
              Get In Touch
            </h2>
            <p className="text-[#9ca3af] text-center mb-12">
              Interested in collaborating or discussing cybersecurity? Let's connect!
            </p>
            <ContactForm />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#2a3150]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#6b7280] text-sm">
            © 2025 {personalInfo.name}. Built with React, FastAPI, and MongoDB.
          </p>
          <p className="text-[#6b7280] text-xs mt-2">
            Securing the digital world, one line of code at a time.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin-analytics-dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// Component to track route changes
function AnalyticsTracker() {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);
  
  return null;
}

export default App;
