'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 280, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e) => {
      // Check if hovering over buttons, interactive items, or links
      const target = e.target;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <>
      {/* Lagging outer pastel ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-amber-300/30 pointer-events-none z-50 hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovered ? 1.5 : clicked ? 0.8 : 1,
          borderColor: isHovered ? 'rgba(251, 191, 36, 0.6)' : 'rgba(253, 244, 255, 0.25)',
          backgroundColor: isHovered ? 'rgba(251, 191, 36, 0.05)' : 'rgba(255, 255, 255, 0)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
      
      {/* Sharp inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-amber-400 pointer-events-none z-50 hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isHovered ? 0.5 : 1,
          backgroundColor: isHovered ? 'rgb(251, 191, 36)' : 'rgb(254, 215, 170)',
        }}
      />
    </>
  );
}
