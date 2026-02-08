import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './InteractiveAvatar.css';

const InteractiveAvatar = () => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [emotion, setEmotion] = useState('neutral');
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!avatarRef.current) return;

      const avatar = avatarRef.current.getBoundingClientRect();
      const avatarCenterX = avatar.left + avatar.width / 2;
      const avatarCenterY = avatar.top + avatar.height / 2;

      const deltaX = e.clientX - avatarCenterX;
      const deltaY = e.clientY - avatarCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 20, 8);

      const eyeX = Math.cos(angle) * distance;
      const eyeY = Math.sin(angle) * distance;

      setEyePosition({ x: eyeX, y: eyeY });

      // Determine emotion based on mouse position
      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distanceFromCenter < 100) {
        setEmotion('surprised');
      } else if (deltaY < -100) {
        setEmotion('happy');
      } else if (deltaY > 100) {
        setEmotion('thinking');
      } else if (Math.abs(deltaX) > 200) {
        setEmotion('curious');
      } else {
        setEmotion('neutral');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getMouthPath = () => {
    switch (emotion) {
      case 'happy':
        return 'M 30 50 Q 50 70 70 50'; // Smile
      case 'surprised':
        return 'M 40 55 Q 50 65 60 55'; // Open mouth
      case 'thinking':
        return 'M 35 50 L 65 50'; // Straight line
      case 'curious':
        return 'M 30 55 Q 50 45 70 55'; // Slight frown
      default:
        return 'M 35 52 Q 50 55 65 52'; // Neutral
    }
  };

  const getEyebrowPath = () => {
    switch (emotion) {
      case 'happy':
        return { left: 'M 20 25 Q 28 20 35 25', right: 'M 65 25 Q 72 20 80 25' };
      case 'surprised':
        return { left: 'M 20 20 Q 28 15 35 20', right: 'M 65 20 Q 72 15 80 20' };
      case 'thinking':
        return { left: 'M 20 25 Q 28 22 35 25', right: 'M 65 23 Q 72 26 80 23' };
      case 'curious':
        return { left: 'M 20 25 Q 28 22 35 25', right: 'M 65 25 Q 72 22 80 25' };
      default:
        return { left: 'M 20 25 Q 28 23 35 25', right: 'M 65 25 Q 72 23 80 25' };
    }
  };

  const eyebrows = getEyebrowPath();

  return (
    <motion.div
      ref={avatarRef}
      className="interactive-avatar-container"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
    >
      <svg
        viewBox="0 0 100 100"
        className="avatar-svg"
        style={{ width: '128px', height: '128px' }}
      >
        {/* Head */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#2d3748"
          stroke="#00d4ff"
          strokeWidth="3"
        />
        
        {/* Hair */}
        <path
          d="M 15 35 Q 10 20 20 15 Q 30 8 50 10 Q 70 8 80 15 Q 90 20 85 35"
          fill="#1a202c"
        />
        
        {/* Eyebrows */}
        <motion.path
          d={eyebrows.left}
          stroke="#00d4ff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={{ d: eyebrows.left }}
          transition={{ duration: 0.3 }}
        />
        <motion.path
          d={eyebrows.right}
          stroke="#00d4ff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={{ d: eyebrows.right }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Eyes */}
        <g className="eyes">
          {/* Left eye */}
          <ellipse
            cx="30"
            cy="35"
            rx="8"
            ry="10"
            fill="white"
          />
          <motion.circle
            cx={30 + eyePosition.x}
            cy={35 + eyePosition.y}
            r="4"
            fill="#00d4ff"
            animate={{
              cx: 30 + eyePosition.x,
              cy: 35 + eyePosition.y
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
          <circle
            cx={30 + eyePosition.x + 1}
            cy={35 + eyePosition.y - 1}
            r="1.5"
            fill="white"
            opacity="0.8"
          />
          
          {/* Right eye */}
          <ellipse
            cx="70"
            cy="35"
            rx="8"
            ry="10"
            fill="white"
          />
          <motion.circle
            cx={70 + eyePosition.x}
            cy={35 + eyePosition.y}
            r="4"
            fill="#00d4ff"
            animate={{
              cx: 70 + eyePosition.x,
              cy: 35 + eyePosition.y
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />
          <circle
            cx={70 + eyePosition.x + 1}
            cy={35 + eyePosition.y - 1}
            r="1.5"
            fill="white"
            opacity="0.8"
          />
        </g>
        
        {/* Nose */}
        <path
          d="M 50 42 L 48 48 L 52 48 Z"
          fill="#1a202c"
          opacity="0.3"
        />
        
        {/* Mouth */}
        <motion.path
          d={getMouthPath()}
          stroke="#00d4ff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={{ d: getMouthPath() }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Neck */}
        <rect
          x="40"
          y="85"
          width="20"
          height="15"
          fill="#2d3748"
        />
        
        {/* Shoulders hint */}
        <path
          d="M 30 95 Q 50 98 70 95"
          stroke="#2d3748"
          strokeWidth="8"
          fill="none"
        />
      </svg>
      
      {/* Emotion indicator */}
      <motion.div
        className="emotion-badge"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-xs text-[#00d4ff] font-mono capitalize">{emotion}</span>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveAvatar;
