'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Hammer, Search, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const HowWeWorkMobile = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const phases = [
    {
      icon: Search,
      number: '01',
      title: 'Architect',
      subtitle: 'Discovery & Blueprint',
      description:
        'Strategic discovery and system architecture planning for long-term scale.',
      details: ['Discovery', 'Architecture', 'Data Mapping', 'Scaling'],
      color: 'from-[#bef264] to-[#a3d936]',
      bgColor: 'bg-[#bef264]/10',
      accentColor: '#bef264',
      borderColor: 'border-[#bef264]/20',
    },
    {
      icon: Hammer,
      number: '02',
      title: 'Engineer',
      subtitle: 'Premium Build',
      description: 'Full-stack engineering with native AI engine integration.',
      details: ['Premium Build', 'AI Engines', 'Cloud Infra', 'QA Testing'],
      color: 'from-[#d9f99d] to-[#bef264]',
      bgColor: 'bg-[#d9f99d]/10',
      accentColor: '#d9f99d',
      borderColor: 'border-[#d9f99d]/20',
    },
    {
      icon: TrendingUp,
      number: '03',
      title: 'Accelerate',
      subtitle: 'Fast Deployment',
      description:
        'Aggressive deployment and real-time performance optimization.',
      details: ['Rapid Launch', 'Performance', 'Onboarding', 'Monitoring'],
      color: 'from-[#f7fee7] to-[#d9f99d]',
      bgColor: 'bg-[#f7fee7]/10',
      accentColor: '#f7fee7',
      borderColor: 'border-[#f7fee7]/20',
    },
    {
      icon: Sparkles,
      number: '04',
      title: 'Dominate',
      subtitle: 'Strategic Evolution',
      description:
        'Competitive advantage through AI-driven insights and evolution.',
      details: ['Growth', 'AI Insights', 'Evolution', 'Excellence'],
      color: 'from-[#bef264] to-[#f7fee7]',
      bgColor: 'bg-[#bef264]/10',
      accentColor: '#bef264',
      borderColor: 'border-[#bef264]/20',
    },
  ];

  // Auto-progress
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % phases.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [phases.length]);

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50 && activePhase < phases.length - 1)
      setActivePhase(activePhase + 1);
    if (distance < -50 && activePhase > 0) setActivePhase(activePhase - 1);
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#020617] py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#bef26405] blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full border border-[#bef26420] bg-[#bef26410] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#bef264]">
            How We Work
          </div>
          <h2 className="mb-4 text-4xl font-black uppercase tracking-tight text-white">
            The <span className="text-[#bef264]">Process</span>
          </h2>
        </div>

        {/* Progress Dots */}
        <div className="mb-10 flex justify-center gap-3">
          {phases.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePhase(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === activePhase ? 'w-12 bg-[#bef264]' : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Swipeable Cards */}
        <div
          className="relative h-[520px]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="popLayout">
            {phases.map((phase, index) => {
              if (index !== activePhase) return null;
              const Icon = phase.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute inset-0"
                >
                  <div className="flex h-full flex-col items-center rounded-[3rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
                    <div
                      className={`h-24 w-24 rounded-[2rem] bg-gradient-to-br ${phase.color} mb-8 p-6 shadow-[0_0_30px_rgba(190,242,100,0.2)]`}
                    >
                      <Icon className="h-full w-full text-black" />
                    </div>

                    <span className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#bef264]">
                      Phase {phase.number}
                    </span>
                    <h3 className="mb-2 text-3xl font-black uppercase tracking-tight text-white">
                      {phase.title}
                    </h3>
                    <p className="mb-6 font-bold italic text-slate-400">
                      {phase.subtitle}
                    </p>

                    <p className="mb-8 flex-grow text-base font-medium leading-relaxed text-slate-400">
                      {phase.description}
                    </p>

                    <div className="grid w-full grid-cols-2 gap-3">
                      {phase.details.map((detail, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-tighter text-slate-300"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default HowWeWorkMobile;
