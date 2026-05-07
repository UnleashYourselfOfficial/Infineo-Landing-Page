/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useVelocity, useAnimationFrame, useMotionValue } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Gift, 
  Users, 
  Zap, 
  ShieldCheck, 
  Trophy, 
  MessageSquare,
  Play,
  Brain,
  Focus,
  Activity,
  Heart,
  Compass,
  Smile,
  Pencil,
  Palette,
  Gamepad2,
  Puzzle,
  Sparkles,
  Star
} from 'lucide-react';

import { LiquidCanvas } from './components/LiquidCanvas';

interface Ball {
  id: number;
  text: string;
  size: number;
  color: string;
  initialX: number;
  initialY: number;
}

const BALLS_CONTENT = [
  { text: "Screen time", size: 140, color: "#E3F2FD" },
  { text: "Low focus", size: 120, color: "#BBDEFB" },
  { text: "Shyness", size: 100, color: "#90CAF9" },
  { text: "Poor behaviour", size: 130, color: "#64B5F6" },
  { text: "Low confidence", size: 150, color: "#42A5F5" },
  { text: "Distraction", size: 110, color: "#BBDEFB", accent: true },
  { text: "Emotional struggle", size: 125, color: "#E3F2FD" },
];

const IrregularUnderline = ({ className = "" }: { className?: string }) => (
  <div className={`absolute -bottom-2 left-0 w-full overflow-visible pointer-events-none ${className}`}>
    <motion.svg 
      width="100%" 
      height="14" 
      viewBox="0 0 160 16" 
      fill="none" 
      preserveAspectRatio="none"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="overflow-visible"
    >
      <path 
        d="M2 11C22 4 42 4 62 11C82 18 102 18 122 11C142 4 152 4 158 11" 
        stroke="#be8c4a" 
        strokeWidth="6" 
        strokeLinecap="round" 
      />
    </motion.svg>
  </div>
);

const MagicCursor = () => {
  const [points, setPoints] = useState<{ x: number; y: number; id: number; color: string }[]>([]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const colors = ['#4A90E2', '#be8c4a', '#f7da99', '#39618d'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setPoints(prev => [...prev.slice(-20), { x: e.clientX, y: e.clientY, id: Date.now(), color: randomColor }]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {points.map((point, i) => (
        <motion.div
          key={point.id}
          initial={{ scale: 1, opacity: 1, rotate: 0 }}
          animate={{ scale: 0, opacity: 0, rotate: 180, y: point.y + 10 }}
          transition={{ duration: 1 }}
          className="absolute"
          style={{ left: point.x, top: point.y }}
        >
          <Sparkles size={12} fill={point.color} className="text-white" />
        </motion.div>
      ))}
    </div>
  );
};

const FloatingDecor = () => {
  const decors = [
    { Icon: Sparkles, color: "text-gold/20", top: "18%", left: "8%", size: 60, rotate: 15 },
    { Icon: BookOpen, color: "text-primary-blue/20", top: "22%", left: "82%", size: 80, rotate: -10 },
    { Icon: Trophy, color: "text-gold/15", top: "68%", left: "6%", size: 70, rotate: 20 },
    { Icon: Heart, color: "text-primary-blue/15", top: "78%", left: "85%", size: 90, rotate: -15 },
    { Icon: Zap, color: "text-gold/15", top: "45%", left: "92%", size: 50, rotate: 30 },
    { Icon: Compass, color: "text-primary-blue/15", top: "52%", left: "3%", size: 65, rotate: -25 },
    { Icon: Smile, color: "text-primary-blue/10", top: "88%", left: "48%", size: 55, rotate: 10 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {decors.map((item, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: item.top, 
            left: item.left,
            rotate: item.rotate
          }}
          animate={{ 
            y: [0, -20, 0],
            rotate: [item.rotate, item.rotate + 10, item.rotate]
          }}
          transition={{ 
            duration: 7 + (i % 3), 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className={`absolute ${item.color}`}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
    </div>
  );
};

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/yournumber" // Replace with actual number
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform overflow-hidden"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp" 
        className="w-full h-full object-contain" 
        referrerPolicy="no-referrer" 
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 bg-[#25D366] rounded-full -z-10"
      />
    </motion.a>
  );
};

const Hero = () => {
  return (
    <SectionReveal id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center py-12 overflow-hidden bg-transparent">
      <FloatingDecor />
      {/* Playful Background Blobs */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0]
          }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[5%] w-80 h-80 bg-primary-blue/15 blob" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -15, 0]
          }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-cream/30 blob" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <RevealChild>
          <div className="flex justify-center mb-6">
             <motion.div 
               animate={{ 
                 rotate: [0, 20, -20, 0], 
                 y: [0, -15, 0],
                 scale: [1, 1.1, 1]
               }}
               transition={{ duration: 4, repeat: Infinity }}
               className="p-4 bg-white rounded-3xl shadow-2xl shadow-primary-blue/20 relative"
             >
                <motion.div 
                  className="absolute -top-4 -right-4"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="text-gold" size={20} />
                </motion.div>
                <BookOpen className="text-primary-blue" size={32} />
             </motion.div>
          </div>
        </RevealChild>
        <RevealChild>
          <h1 className="text-4xl md:text-7xl font-bold text-dark-blue mb-6 leading-[1.1] max-w-4xl mx-auto tracking-tight font-black">
            Ancient Wisdom for <br/> <span className="text-primary-blue inline-block">Modern Kids</span>
          </h1>
        </RevealChild>

        <RevealChild>
          <p className="text-lg md:text-xl text-secondary-blue/80 mb-8 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            Help your child become confident, focused, and emotionally strong through <span className="text-primary-blue relative inline-block">
              fun 1:1 storytelling
              <IrregularUnderline className="-bottom-1" />
            </span>.
          </p>
        </RevealChild>
        
        <RevealChild>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: -2 }}
              whileTap={{ scale: 0.9 }}
              className="px-10 py-5 bg-gold text-white rounded-3xl font-black text-xl shadow-2xl shadow-gold/30 hover:shadow-gold/50 transition-all flex items-center gap-4 group"
            >
              Start Free Trial <Play className="fill-current group-hover:scale-125 transition-transform" size={24} />
            </motion.button>
          </div>
        </RevealChild>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
          {[
            { text: "1:1 Magic", icon: <Users size={20} />, bg: "bg-blue-50" },
            { text: "30-min Stories", icon: <Clock size={20} />, bg: "bg-amber-50" },
            { text: "Free Gift Kit", icon: <Gift size={20} />, bg: "bg-emerald-50" }
          ].map((item, i) => (
            <RevealChild key={i}>
              <div 
                className={`flex items-center gap-3 ${item.bg} px-6 py-3 rounded-2xl border-2 border-white text-dark-blue font-black text-xs shadow-lg hover:scale-105 transition-transform cursor-default uppercase tracking-tight`}
              >
                <span className="text-primary-blue">{item.icon}</span>
                {item.text}
              </div>
            </RevealChild>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

const ProblemChaos = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const sizeMultiplier = isMobile ? 0.65 : 1;
    
    // Tighter grid to keep balls in a rectangle
    const grid = isMobile ? [
      { x: 10, y: 10 }, 
      { x: 55, y: 5 }, 
      { x: 5, y: 35 },
      { x: 50, y: 40 }, 
      { x: 10, y: 65 }, 
      { x: 60, y: 70 },
      { x: 35, y: 20 }
    ] : [
      { x: 10, y: 10 }, 
      { x: 40, y: 5 }, 
      { x: 70, y: 10 },
      { x: 15, y: 55 }, 
      { x: 45, y: 60 }, 
      { x: 75, y: 55 },
      { x: 42, y: 35 }
    ];

    const newBalls = BALLS_CONTENT.map((item, i) => ({
      id: i,
      text: item.text,
      size: item.size * sizeMultiplier,
      color: item.color,
      initialX: grid[i % grid.length].x,
      initialY: grid[i % grid.length].y,
    }));
    setBalls(newBalls);
  }, []);

  return (
    <SectionReveal id="challenges" className="relative py-8 px-6 overflow-hidden bg-white/20 backdrop-blur-sm min-h-[85vh] flex flex-col justify-center">
      <div className="container mx-auto text-center relative z-20 mb-2">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-bold text-dark-blue mb-2 tracking-tighter"
        >
          Is Your Child Facing <br/> <motion.span 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-primary-blue inline-block font-black"
          >These Challenges?</motion.span>
        </motion.h2>
      </div>

      <div className="relative h-[400px] md:h-[500px] w-full max-w-6xl mx-auto z-10">
        <AnimatePresence>
          {balls.map((ball) => (
            <motion.div
              key={ball.id}
              drag
              dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
              dragElastic={0.8}
              whileDrag={{ scale: 1.3, zIndex: 100, rotate: 15 }}
              style={{
                width: ball.size,
                height: ball.size,
                left: `${ball.initialX}%`,
                top: `${ball.initialY}%`,
                backgroundColor: ball.color,
              }}
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              whileInView={{ 
                scale: 1, 
                opacity: 1,
                rotate: 0,
                transition: { delay: ball.id * 0.1, type: "spring", bounce: 0.6 }
              }}
              animate={{ 
                x: [0, 10, -10, 0],
                y: [0, -10, 10, 0],
              }}
              whileHover={{ 
                scale: 1.15,
                boxShadow: "0 0 50px rgba(74, 144, 226, 0.4)",
                zIndex: 50,
                backgroundColor: "#4A90E2",
                color: "#FFFFFF"
              }}
              transition={{
                x: { duration: 4 + ball.id, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 3 + ball.id, repeat: Infinity, ease: "easeInOut" },
              }}
              viewport={{ once: true }}
              className="absolute rounded-full flex items-center justify-center p-6 text-center cursor-grab active:cursor-grabbing transition-colors border-2 border-white shadow-xl backdrop-blur-sm"
            >
              <div className="flex flex-col items-center">
                <span className="font-black text-xs md:text-base leading-tight select-none uppercase tracking-tight">
                  {ball.text}
                </span>
                <motion.div 
                  className="mt-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Activity size={12} className="opacity-40" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SectionReveal>
  );
};

const JourneySteps = () => {
  const steps = [
    { title: "Story Time", icon: <BookOpen />, color: "bg-pink-100", desc: "Magical tales that spark wonder.", pulse: "shadow-pink-200" },
    { title: "Play & Learn", icon: <Play />, color: "bg-sky-100", desc: "Games that make learning fun!", pulse: "shadow-sky-200" },
    { title: "Real-Life Fun", icon: <Users />, color: "bg-emerald-100", desc: "Solving puzzles with new friends.", pulse: "shadow-emerald-200" },
    { title: "Super Skills", icon: <Sparkles />, color: "bg-purple-100", desc: "Building superpowers for the future.", pulse: "shadow-purple-200" },
  ];

  return (
    <SectionReveal id="how-it-works" className="py-8 bg-white/10 backdrop-blur-sm relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12"
          >
             <Clock className="text-white" size={24} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold text-dark-blue mb-1"
          >
            Inside the <motion.span 
              className="text-primary-blue relative inline-block"
              whileInView={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -5, 5, 0],
                transition: { duration: 1.2, delay: 0.2, ease: "easeInOut" }
              }}
              viewport={{ once: true }}
            >
              30-Min
              <IrregularUnderline className="-bottom-3" />
              <motion.div
                className="absolute inset-0 bg-primary-blue/30 rounded-full -z-10"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </motion.span> Journey
          </motion.h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Animated Path */}
          <svg className="absolute top-1/2 left-0 w-full h-40 -translate-y-1/2 hidden md:block overflow-visible z-0" viewBox="0 0 1000 100">
            <motion.path
              d="M 0,50 C 150,-50 250,150 400,50 C 550,-50 650,150 800,50 C 950,-50 1050,150 1200,50"
              fill="none"
              stroke="#4A90E2"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="1 15"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.2 }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            />
          </svg>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.4 + i * 0.15, 
                  type: "spring", 
                  stiffness: 70, 
                  damping: 12 
                }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-32 h-32 rounded-[40px] ${step.color} text-dark-blue flex items-center justify-center mb-8 shadow-2xl ${step.pulse} group-hover:scale-110 transition-all duration-500 relative`}>
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-xl shadow-xl text-primary-blue z-20 border-2 border-primary-blue/10">
                    {i + 1}
                  </div>
                  <motion.div 
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }} 
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {React.cloneElement(step.icon as React.ReactElement, { size: 56 })}
                  </motion.div>
                </div>
                <h3 className="text-3xl font-black text-dark-blue mb-4 tracking-tight">{step.title}</h3>
                <p className="text-secondary-blue/80 text-lg px-2 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
};

const WhyParents = () => {
  const cards = [
    { 
      title: "1-on-1 Magic", 
      desc: "Every child is a unique star. Our mentors adapt to your child's personality, ensuring they stay engaged and happy.", 
      icon: <Heart className="text-rose-500" />, 
      bg: "bg-rose-50",
      border: "border-rose-100",
      accent: "bg-rose-500/10"
    },
    { 
      title: "Playful Learning", 
      desc: "No more boring lectures. We use interactive stories and games that make your child look forward to every session.", 
      icon: <Zap className="text-amber-500" />, 
      bg: "bg-amber-50",
      border: "border-amber-100",
      accent: "bg-amber-500/10"
    },
    { 
      title: "Family First", 
      desc: "Parenting is busy! Our flexible booking system lets you schedule sessions around your life, not the other way around.", 
      icon: <Clock className="text-primary-blue" />, 
      bg: "bg-blue-50",
      border: "border-blue-100",
      accent: "bg-primary-blue/10"
    },
  ];

  return (
    <SectionReveal className="py-10 bg-white/20 backdrop-blur-md relative overflow-hidden">
      {/* Playful background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-rose-200 blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-64 h-64 rounded-full bg-blue-200 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 rounded-full bg-gold/10 text-gold font-black text-xs uppercase tracking-[0.2em] mb-6"
          >
            Trusted by modern families
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold text-dark-blue mb-6 tracking-tight"
          >
            The Infineo <span className="text-primary-blue">Difference</span>
          </motion.h2>
          <p className="text-xl text-secondary-blue/60 max-w-2xl mx-auto font-medium">
            We combined child psychology with ancient storytelling to create an experience kids actually love.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", bounce: 0.4 }}
              className={`${card.bg} ${card.border} border-2 p-12 rounded-[50px] relative group hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-2xl`}
            >
              <div className={`w-20 h-20 rounded-3xl ${card.accent} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(card.icon as React.ReactElement, { size: 40 })}
              </div>
              <h3 className="text-3xl font-black text-dark-blue mb-6 tracking-tight">{card.title}</h3>
              <p className="text-secondary-blue/70 leading-relaxed text-lg font-medium">
                {card.desc}
              </p>
              
              {/* Decorative sparkle on hover */}
              <motion.div 
                className="absolute top-8 right-8 text-gold opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles size={24} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

const WaveDivider = ({ flip = false, color = "fill-white/10" }: { flip?: boolean, color?: string }) => {
  return (
    <div className={`relative w-full h-24 overflow-hidden pointer-events-none ${flip ? 'rotate-180' : ''}`}>
      <motion.svg 
        animate={{ 
          x: [-20, 20, -20],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-0 w-[110%] h-full left-[-5%]" 
        preserveAspectRatio="none" 
        viewBox="0 0 1440 320"
      >
        <path 
          className={color}
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,213.3C960,224,1056,192,1152,160C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </motion.svg>
    </div>
  );
};

const MorphWord: React.FC<{ word: string, index: number, total: number, progress: any }> = ({ word, index, total, progress }) => {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const center = (start + end) / 2;

  const opacity = useTransform(progress, [start, center, end], [0, 1, 0]);
  const scale = useTransform(progress, [start, center, end], [0.8, 1, 1.2]);
  const blurValue = useTransform(progress, [start, center, end], [15, 0, 15]);

  return (
    <motion.div
      style={{ 
        opacity, 
        scale, 
        filter: useTransform(blurValue, (v) => `blur(${v}px)`),
      }}
      className="absolute text-6xl md:text-[10rem] font-black text-primary-blue whitespace-nowrap"
    >
      {word}
    </motion.div>
  );
};

const Outcomes = () => {
  const values = ["CONFIDENCE", "FOCUS", "EMPATHY", "RESILIENCE", "INTEGRITY"];
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We replace scrollYProgress with a manually driven MotionValue
  const progress = useMotionValue(0);
  const [isLocked, setIsLocked] = useState(false);
  const lockCooldown = useRef(false);

  // 1. Observer to detect when the section fills the screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
          // Lock the scroll only if we aren't in a cooldown period
          if (!lockCooldown.current) {
            setIsLocked(true);
          }
        }
      },
      { threshold: 0.95 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 2. Intercept wheel and touch events to drive the animation
  useEffect(() => {
    if (!isLocked || !containerRef.current) {
      document.body.style.overflow = "auto";
      return;
    }

    // Snap the container perfectly into view to prevent visual jitter
    containerRef.current.scrollIntoView({ behavior: "instant", block: "center" });
    
    // Disable global body scrolling
    document.body.style.overflow = "hidden";

    let touchStartY = 0;

    const unlockAndEscape = (direction: 'up' | 'down') => {
      setIsLocked(false);
      lockCooldown.current = true;
      
      // 1-second cooldown before it can lock again to prevent getting stuck
      setTimeout(() => (lockCooldown.current = false), 1000);

      // Restore native scroll so window.scrollBy works smoothly
      document.body.style.overflow = "auto";
      
      // Nudge the window outside the intersection threshold
      window.scrollBy({ top: direction === 'down' ? 150 : -150, behavior: "smooth" });
    };

    const updateProgress = (delta: number) => {
      const current = progress.get();
      const speed = 0.0006; // Adjust this to change how much scrolling is required
      const next = Math.max(0, Math.min(1, current + delta * speed));

      progress.set(next);

      // Unlock logic when hitting the boundaries of the words
      if (next >= 1 && delta > 0) {
        unlockAndEscape('down');
      } else if (next <= 0 && delta < 0) {
        unlockAndEscape('up');
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      updateProgress(e.deltaY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      updateProgress(deltaY * 2); // Multiplier for touch sensitivity
    };

    // passive: false is required so we can call e.preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isLocked, progress]);

  return (
    // Replaced h-[400vh] with h-screen
    <div ref={containerRef} id="outcomes" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent">
      {/* Threshold Filter for Morph Effect */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="threshold">
            <feColorMatrix 
              in="SourceGraphic" 
              type="matrix" 
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 25 -9" 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <div className="max-w-4xl mb-2 md:mb-4">
          <RevealChild>
            <div className="inline-block px-4 py-1 rounded-full bg-primary-blue/5 text-primary-blue font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              The Foundation
            </div>
          </RevealChild>
          <RevealChild>
            <h2 className="text-3xl md:text-5xl font-black text-dark-blue leading-[0.85] tracking-tighter mb-2">
              Values That <br/>Last a <span className="text-primary-blue">Lifetime</span>
            </h2>
          </RevealChild>
          <RevealChild>
            <p className="text-base md:text-lg text-secondary-blue/60 leading-relaxed font-medium mx-auto max-w-2xl">
              We believe in nurturing the core character of every child. Through our modules, we instill foundational virtues that go beyond academics.
            </p>
          </RevealChild>
        </div>

        <div className="relative w-full h-[120px] md:h-[220px] flex items-center justify-center" style={{ filter: "url(#threshold)" }}>
          {values.map((word, i) => (
            <MorphWord 
              key={word} 
              word={word} 
              index={i} 
              total={values.length} 
              progress={progress} // Now driven by the trapped wheel events
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Curriculum = () => {
  return (
    <SectionReveal id="curriculum" className="py-8 bg-white/40 backdrop-blur-md relative overflow-hidden">
      <div className="container mx-auto px-6 text-center max-w-7xl">
        <div className="max-w-3xl mx-auto">
          <RevealChild>
            <h2 className="text-4xl md:text-6xl font-black text-dark-blue mb-4 tracking-tighter">
              A Journey Through <br/> <span className="text-primary-blue">7 Sacred Modules</span>
            </h2>
          </RevealChild>
          <RevealChild>
            <p className="text-xl md:text-2xl italic text-secondary-blue/60 mb-8">
              From the birth of Ganesha to the wisdom of the Bhagavad Gita
            </p>
          </RevealChild>
        </div>
      </div>
    </SectionReveal>
  );
};

const FinalCTA = () => {
  const kitItems = [
    { name: "Certificate", desc: "Digital Achievement Badge", icon: <Trophy className="text-amber-500" /> },
    { name: "Drawing Sheet", desc: "Printable sketch canvas", icon: <Pencil className="text-blue-400" /> },
    { name: "Coloring Sheet", desc: "Printable coloring art", icon: <Palette className="text-rose-400" /> },
    { name: "Maze Master", desc: "Interactive PDF puzzles", icon: <Gamepad2 className="text-emerald-400" /> },
    { name: "Mind Games", desc: "Digital Word Search", icon: <Puzzle className="text-purple-400" /> },
  ];

  return (
    <SectionReveal id="cta" className="py-12 px-6 bg-transparent relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <RevealChild>
          <div className="relative bg-gradient-to-br from-[#B3E5FC]/90 to-white/80 backdrop-blur-3xl rounded-[60px] p-8 md:p-20 overflow-hidden flex flex-col md:flex-row items-center gap-16 border border-white/50 shadow-2xl">
            {/* Animated Background Graphics */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -ml-48 -mb-48" />
            
            <div className="md:w-1/2 text-center md:text-left z-10">
              <RevealChild>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#be8c4a] text-white rounded-xl text-sm font-black uppercase tracking-widest mb-8 shadow-lg">
                  <Star size={16} fill="currentColor" className="text-white" />
                  TRIAL COMPLETION REWARD
                </div>
              </RevealChild>
              
              <RevealChild>
                <h2 className="text-5xl md:text-7xl font-bold text-[#112b47] mb-8 leading-tight">
                  The Journey <br/>Awaits!
                </h2>
              </RevealChild>
              
              <RevealChild>
                <p className="text-xl text-[#112b47]/80 mb-12 max-w-xl font-medium leading-relaxed">
                  Book your 1:1 session today. Once finished, we'll unlock your <span className="text-[#112b47] font-black underline decoration-gold/50 decoration-4 underline-offset-4">Success Kit</span> containing all the digital goodies below!
                </p>
              </RevealChild>

              <RevealChild>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(17, 43, 71, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-14 py-6 bg-[#112b47] text-white rounded-3xl font-black text-2xl shadow-xl transition-all flex items-center gap-4 group mx-auto md:mx-0"
                >
                  Book Free Trial
                  <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </RevealChild>
            </div>

            <div className="md:w-1/2 relative z-10 flex justify-center items-center h-[500px]">
              {/* Playful Gift Reveal Container */}
              <div className="relative w-full max-w-[400px] h-[400px] flex items-center justify-center">
                
                {/* Floating Reward Cards */}
                <AnimatePresence>
                  {kitItems.map((item, i) => {
                    const angles = [-150, -75, 0, 75, 150];
                    const angle = (angles[i] * Math.PI) / 180;
                    const radius = 210;
                    const x = Math.cos(angle) * (radius + (i % 2 === 0 ? 20 : 0));
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                        whileInView={{ scale: 1, x: x, y: y, opacity: 1 }}
                        animate={{
                          y: [y, y - 10, y],
                          rotate: [0, i % 2 === 0 ? 3 : -3, 0]
                        }}
                        transition={{ 
                          delay: 0.5 + i * 0.1,
                          y: { repeat: Infinity, duration: 4 + i, ease: "easeInOut" },
                          scale: { type: "spring", stiffness: 100, damping: 10 }
                        }}
                        viewport={{ once: true }}
                        className="absolute bg-white p-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-dark-blue/5 flex items-center gap-3 min-w-[150px] z-20 group hover:scale-110 transition-transform"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shadow-inner">
                          {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                        </div>
                        <div className="text-left">
                          <div className="text-[#112b47] font-black text-[10px] uppercase tracking-tight">{item.name}</div>
                          <div className="text-secondary-blue/40 text-[8px] font-black uppercase tracking-wider">LOCKED</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Central Reward Graphic */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-primary-blue rounded-full blur-[60px] transform -translate-y-4"
                  />
                  
                  <div className="relative bg-white p-10 rounded-[48px] shadow-2xl border-4 border-gold/20 flex flex-col items-center min-w-[200px]">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    >
                      <Gift size={70} className="text-gold" strokeWidth={1.5} />
                    </motion.div>
                    <div className="mt-4 text-center">
                      <div className="text-[#112b47] font-black text-sm uppercase tracking-[0.2em] mb-1">YOUR GIFT</div>
                      <div className="px-4 py-1.5 bg-primary-blue/10 rounded-full text-primary-blue text-[10px] font-black uppercase tracking-widest">
                        POST-TRIAL
                      </div>
                    </div>
                  </div>

                  {/* Decorative Sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        y: [0, -50, -80],
                        x: [0, (i % 2 === 0 ? 40 : -40), (i % 2 === 0 ? 60 : -60)]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5 + i * 0.5,
                        delay: i * 0.4
                      }}
                      className="absolute top-1/2 left-1/2 text-gold z-0"
                    >
                      <Sparkles size={16} fill="currentColor" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </RevealChild>
      </div>
    </SectionReveal>
  );
};

const Footer = () => {
  return (
    <footer className="py-16 bg-[#0a192f] border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-blue rounded-full blur-[120px]" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col items-start gap-8">
            <img src="logo_with_text.png" alt="Infineo Logo" className="h-16 w-auto" referrerPolicy="no-referrer" />
            <p className="text-white/60 text-lg max-w-sm leading-relaxed font-medium">
              Modern storytelling based on ancient wisdom, designed to empower kids for the future.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-white/70">
                <li><button onClick={() => document.getElementById('curriculum')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-primary-blue transition-colors">Curriculum</button></li>
                <li><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})} className="hover:text-primary-blue transition-colors">How it works</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <a href="#" className="flex items-center gap-2 text-white hover:text-primary-blue transition-colors font-bold">
                <MessageSquare className="text-green-400 w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 uppercase tracking-widest font-black">
          <div>&copy; 2026 Infineo EdTech Private Limited</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary-blue transition-colors text-white/60">Privacy Policy</a>
            <a href="#" className="hover:text-primary-blue transition-colors text-white/60">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What does Infineo do?",
      a: "Infineo is an ed-tech platform that provides live 1:1 storytelling classes for kids aged 5-12. We use traditional Hinduism stories to help children build confidence, focus, and emotional strength while solving modern-day challenges like shyness and screen addiction."
    },
    {
      q: "What is the class format and duration?",
      a: "Each session is a live 1:1 interactive class on Zoom that lasts for 30 minutes. This ensures your child gets the educator's undivided attention throughout the journey."
    },
    {
      q: "How often are the classes conducted?",
      a: "Classes are typically held twice per week. The schedule is flexible and can be customized by parents based on their child's routine and availability."
    },
    {
      q: "Is there a free trial class?",
      a: "Yes! We offer a one-time free trial class of 30 minutes. Upon successful completion of the trial, we also provide an exclusive kit containing drawing sheets, coloring sheets, maze games, and more."
    },
    {
      q: "What is the pricing for the program?",
      a: "After the free trial, our standard pricing is ₹5,000 for 10 classes (₹500 per class). We also have an inaugural offer of ₹4,500 for 10 classes (₹450 per class) and further discounts for longer enrollments."
    }
  ];

  return (
    <SectionReveal id="faqs" className="py-20 bg-white/30 backdrop-blur-xl relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <RevealChild>
            <h2 className="text-4xl md:text-6xl font-black text-dark-blue mb-4 tracking-tighter text-center">
              Common <span className="text-primary-blue">Questions</span>
            </h2>
          </RevealChild>
          <RevealChild>
            <p className="text-lg text-secondary-blue/60 font-medium">Everything you need to know about starting your child's journey.</p>
          </RevealChild>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <RevealChild key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full text-left p-6 md:p-8 rounded-[32px] transition-all duration-500 border-2 ${
                  openIndex === i 
                    ? "bg-white border-primary-blue shadow-xl" 
                    : "bg-white/50 border-white hover:border-primary-blue/30"
                }`}
              >
                <div className="flex justify-between items-center gap-4">
                  <span className={`text-lg md:text-xl font-black ${openIndex === i ? "text-primary-blue" : "text-dark-blue"}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${openIndex === i ? "bg-primary-blue text-white" : "bg-dark-blue/5 text-dark-blue"}`}
                  >
                    <Zap size={16} fill={openIndex === i ? "currentColor" : "none"} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-secondary-blue/80 text-lg leading-relaxed font-sans font-medium">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </RevealChild>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Parent of 7yo",
      desc: "My daughter used to be very shy. After just one module on Ganesha stories, she's narrated the 'Moon' story to everyone who visits us. Her confidence has soared!",
      avatar: "https://i.pravatar.cc/150?u=priya",
      color: "bg-blue-50"
    },
    {
      name: "Rajesh Iyer",
      role: "Parent of 9yo",
      desc: "Finding high-quality cultural education that isn't boring was a challenge. Infineo's 1:1 sessions are interactive and my son actually looks forward to them every week.",
      avatar: "https://i.pravatar.cc/150?u=rajesh",
      color: "bg-gold/10"
    },
    {
      name: "Anjali Mehta",
      role: "Parent of 6yo",
      desc: "I was worried about screen addiction. But these 30 minutes are so productive. She learns valuable life lessons through stories that I struggled to teach her myself.",
      avatar: "https://i.pravatar.cc/150?u=anjali",
      color: "bg-emerald-50"
    }
  ];

  return (
    <SectionReveal id="testimonials" className="py-20 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <RevealChild>
            <h2 className="text-4xl md:text-7xl font-black text-dark-blue mb-4 tracking-tighter">
              Happy <span className="text-primary-blue">Families</span>
            </h2>
          </RevealChild>
          <RevealChild>
            <p className="text-xl text-secondary-blue/60 font-medium">See how Infineo is making a difference in children's lives.</p>
          </RevealChild>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <RevealChild key={i}>
              <motion.div
                whileHover={{ y: -10 }}
                className={`${t.color} p-10 rounded-[48px] border-2 border-white shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col`}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-black text-dark-blue">{t.name}</h4>
                    <p className="text-xs text-secondary-blue font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <div className="relative">
                  <MessageSquare className="absolute -top-4 -left-4 text-primary-blue/10 w-12 h-12" />
                  <p className="text-lg text-secondary-blue/80 font-medium leading-relaxed italic relative z-10">
                    "{t.desc}"
                  </p>
                </div>
                <div className="mt-8 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#be8c4a" className="text-gold" />
                  ))}
                </div>
              </motion.div>
            </RevealChild>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};

const SectionReveal = ({ children, id, className }: { children: React.ReactNode, id?: string, className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  
  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.98,
      filter: "blur(8px)"
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const RevealChild = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      rotate: -1.5,
      scale: 0.95,
      filter: "blur(4px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 1, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

const SectionBridge = ({ color = "text-primary-blue/10", height = "h-12 md:h-16" }: { color?: string, height?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div ref={ref} className={`relative ${height} w-full pointer-events-none overflow-visible`}>
      <motion.div style={{ y: y1, rotate }} className={`absolute left-[10%] top-0 ${color}`}>
        <Sparkles size={40} />
      </motion.div>
      <motion.div style={{ y: y2, rotate: -rotate }} className={`absolute right-[15%] top-10 ${color}`}>
        <Star size={30} />
      </motion.div>
    </div>
  );
};

const MagicPath = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed left-0 top-0 w-full h-full pointer-events-none z-0 hidden lg:block opacity-[0.12]">
      <svg width="100%" height="100%" viewBox="0 0 1440 5000" fill="none" preserveAspectRatio="none">
        <motion.path
          d="M 120,0 C 120,500 1320,500 1320,1000 S 120,1500 120,2000 S 1320,2500 1320,3000 S 120,3500 120,4000 S 1320,4500 1320,5000"
          stroke="#4A90E2"
          strokeWidth="60"
          strokeLinecap="round"
          strokeDasharray="1 120"
          style={{ pathLength }}
          className="drop-shadow-[0_0_15px_rgba(74,144,226,0.3)]"
        />
        <motion.circle
          cx="120"
          cy="0"
          r="20"
          fill="#4A90E2"
          style={{ 
            offsetPath: "path('M 120,0 C 120,500 1320,500 1320,1000 S 120,1500 120,2000 S 1320,2500 1320,3000 S 120,3500 120,4000 S 1320,4500 1320,5000')",
            offsetDistance: useTransform(pathLength, [0, 1], ["0%", "100%"])
          }}
        />
      </svg>
    </div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="selection:bg-primary-blue/30 selection:text-dark-blue relative overflow-x-hidden">
      <LiquidCanvas />
      <MagicCursor />
      <MagicPath />
      <WhatsAppButton />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled 
          ? "bg-gradient-to-r from-white/40 via-white/60 to-white/40 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.6)] py-0 h-16" 
          : "bg-transparent border-transparent py-4 h-20"
      }`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div 
            onClick={() => scrollToSection("hero")}
            className="cursor-pointer group"
          >
            <img src="logo_with_text.png" alt="Infineo Logo" className="h-10 md:h-12 w-auto" referrerPolicy="no-referrer" />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
             <button onClick={() => scrollToSection("how-it-works")} className="text-sm font-bold text-secondary-blue hover:text-primary-blue transition-colors">How it works</button>
             <button onClick={() => scrollToSection("testimonials")} className="text-sm font-bold text-secondary-blue hover:text-primary-blue transition-colors">Families</button>
             <button onClick={() => scrollToSection("faqs")} className="text-sm font-bold text-secondary-blue hover:text-primary-blue transition-colors">FAQs</button>
             <motion.button 
               whileHover={{ scale: 1.05, backgroundColor: "#be8c4a" }}
               whileTap={{ scale: 0.95 }}
               onClick={() => scrollToSection("cta")}
               className="px-8 py-3 bg-dark-blue text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-dark-blue/20 transition-colors"
             >
               Book Trial
             </motion.button>
          </div>
        </div>
      </nav>

      {/* Page Sections */}
      <Hero />
      <SectionBridge />
      <WaveDivider color="fill-white/20" />
      <ProblemChaos />
      <SectionBridge color="text-gold/20" />
      <WaveDivider color="fill-white/10" flip />
      <JourneySteps />
      <SectionBridge color="text-primary-blue/20" height="h-10 md:h-12" />
      <WaveDivider color="fill-white/10" />
      <WhyParents />
      <Testimonials />
      <Outcomes />
      <SectionBridge color="text-indigo-400/20" height="h-8 md:h-10" />
      <Curriculum />
      <SectionBridge color="text-amber-400/20" height="h-10 md:h-12" />
      <FAQs />
      <FinalCTA />
      <Footer />
    </main>
  );
}
