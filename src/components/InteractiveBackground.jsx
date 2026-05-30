'use client';
import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse coords
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Track mouse leaving
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // Wave configurations
    const waves = [
      {
        y: height * 0.5,
        length: 0.002,
        amplitude: 28,
        speed: 0.012,
        phase: 0,
        color: 'rgba(200, 169, 110, 0.025)' // Gold wave 1
      },
      {
        y: height * 0.55,
        length: 0.0015,
        amplitude: 45,
        speed: -0.007,
        phase: 100,
        color: 'rgba(200, 169, 110, 0.015)' // Gold wave 2
      },
      {
        y: height * 0.45,
        length: 0.0025,
        amplitude: 18,
        speed: 0.018,
        phase: 250,
        color: 'rgba(200, 169, 110, 0.01)' // Gold wave 3
      }
    ];

    // Main animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Clear with very slight transparency to enable subtle trailing
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, width, height);

      // Soft ease interpolation for cursor spring physics
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
      } else {
        // Gently slide cursor back to center when inactive
        mouse.x += (width * 0.5 - mouse.x) * 0.02;
        mouse.y += (height * 0.5 - mouse.y) * 0.02;
      }

      // Draw each wave
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        // Map coordinates across screen width
        for (let x = 0; x < width; x += 3) {
          // Base math sine wave
          let y = wave.y + Math.sin(x * wave.length + wave.phase) * wave.amplitude;

          // Interactive fluid ripple based on cursor distance
          const dx = x - mouse.x;
          const dy = wave.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 380) {
            // Stronger ripple influence the closer the cursor is
            const influence = (1 - distance / 380) * 45;
            y += Math.sin((x - mouse.x) * 0.015 + wave.phase) * influence;
          }

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);

        // Styling
        ctx.fillStyle = wave.color;
        ctx.fill();

        // Increment phase/speed
        wave.phase += wave.speed;
      });

      // Subtle ambient gold cursor glow overlay
      if (mouse.active) {
        const glowRadius = 180;
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, glowRadius
        );
        gradient.addColorStop(0, 'rgba(200, 169, 110, 0.015)');
        gradient.addColorStop(1, 'rgba(200, 169, 110, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animate();

    // Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-[#0d0d0d]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
