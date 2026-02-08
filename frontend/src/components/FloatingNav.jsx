import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Code, Award, Mail, Menu, X } from 'lucide-react';

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'about', icon: User, label: 'About' },
    { id: 'projects', icon: Code, label: 'Projects' },
    { id: 'certifications', icon: Award, label: 'Certifications' },
    { id: 'contact', icon: Mail, label: 'Contact' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-6 right-6 z-50 md:hidden bg-[#1a1f3a]/80 backdrop-blur-lg border border-[#2a3150] rounded-full p-3 text-[#00d4ff] hover:bg-[#1a1f3a] transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Desktop Floating Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1f3a]/80 backdrop-blur-lg border border-[#2a3150] rounded-full px-6 py-3 gap-2"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group ${
                activeSection === item.id
                  ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                  : 'text-[#9ca3af] hover:text-[#00d4ff]'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-[#00d4ff]/10 rounded-full border border-[#00d4ff]/30"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-[#0a0e27]/95 backdrop-blur-lg"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 h-full w-64 bg-[#131829] border-l border-[#2a3150] p-6 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === item.id
                          ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30'
                          : 'text-[#9ca3af] hover:text-[#00d4ff] hover:bg-[#1a1f3a]'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;