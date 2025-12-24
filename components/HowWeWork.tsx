'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Hammer, Search, Sparkles, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const HowWeWorkMobile = dynamic(() => import('./HowWeWorkMobile'), {
  ssr: false,
  loading: () => (
    <div className="bg-gradient-to-br from-slate-50/50 to-white py-16" />
  ),
});

const HowWeWork = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return <HowWeWorkMobile />;
  }

  return <HowWeWorkDesktop />;
};

const HowWeWorkDesktop = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const phases = [
    {
      icon: Search,
      number: '01',
      title: 'Architect',
      subtitle: 'Discovery & Blueprint',
      description:
        "We don't just gather requirements; we architect a strategic blueprint tailored for your long-term success.",
      details: [
        'Strategic discovery',
        'System architecture',
        'Data ecosystem mapping',
        'Scalability planning',
      ],
      color: 'from-[#bef264] to-[#a3d936]',
      bgColor: 'bg-[#bef264]/10',
      accentColor: '#bef264',
      borderColor: 'border-[#bef264]/20',
    },
    {
      icon: Hammer,
      number: '02',
      title: 'Engineer',
      subtitle: 'Premium Implementation',
      description:
        'Our world-class engineering team builds your custom system with precision, power, and zero legacy baggage.',
      details: [
        'Full-stack engineering',
        'AI engine integration',
        'Cloud infrastructure',
        'Continuous testing',
      ],
      color: 'from-[#d9f99d] to-[#bef264]',
      bgColor: 'bg-[#d9f99d]/10',
      accentColor: '#d9f99d',
      borderColor: 'border-[#d9f99d]/20',
    },
    {
      icon: TrendingUp,
      number: '03',
      title: 'Accelerate',
      subtitle: 'Launch & Optimization',
      description:
        'We enable a rapid launch while maintaining extreme performance, ensuring you hit the ground running.',
      details: [
        'Aggressive deployment',
        'Performance tuning',
        'Team onboarding',
        'Real-time monitoring',
      ],
      color: 'from-[#f7fee7] to-[#d9f99d]',
      bgColor: 'bg-[#f7fee7]/10',
      accentColor: '#f7fee7',
      borderColor: 'border-[#f7fee7]/20',
    },
    {
      icon: Sparkles,
      number: '04',
      title: 'Dominate',
      subtitle: 'Ecosystem Success',
      description:
        'Your system becomes your greatest competitive advantage, powering your dominance in the digital age.',
      details: [
        'Workflow revolution',
        'Exponential growth',
        'AI-driven insights',
        'Strategic evolution',
      ],
      color: 'from-[#bef264] to-[#f7fee7]',
      bgColor: 'bg-[#bef264]/10',
      accentColor: '#bef264',
      borderColor: 'border-[#bef264]/20',
    },
  ];

  // Timeline progress animation
  const timelineProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 100]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#020617] py-24 md:py-40"
    >
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-[40%] w-[40%] rounded-full bg-[#bef26405] blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 h-[40%] w-[40%] rounded-full bg-[#bef26403] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32 text-center"
        >
          <div className="mb-8 inline-block rounded-full border border-[#bef26420] bg-[#bef26410] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#bef264]">
            How We Partner
          </div>

          <h2 className="mb-10 text-4xl font-bold leading-tight tracking-tight text-white md:text-7xl">
            From vision to{' '}
            <span className="bg-gradient-to-r from-[#bef264] to-[#f7fee7] bg-clip-text text-transparent">
              digital dominance
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-slate-400">
            Our systematic approach ensures every project is delivered with
            uncompromising quality and strategic impact.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transform">
            <div className="h-full w-full bg-white/5" />
            <motion.div
              className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-[#bef264] via-[#d9f99d] to-[#f7fee7]"
              style={{ height: `${timelineProgress}%` }}
            />
          </div>

          {/* Phase Cards */}
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className={`relative mb-40 flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}
                onMouseEnter={() => setHoveredPhase(index)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 top-10 z-20 -translate-x-1/2 -translate-y-1/2 transform">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-[#020617] p-4 shadow-2xl transition-transform duration-500 ${hoveredPhase === index ? 'scale-110 border-[#bef26440] shadow-[0_0_30px_rgba(190,242,100,0.2)]' : ''}`}
                  >
                    <div
                      className={`h-full w-full rounded-full bg-gradient-to-br ${phase.color} absolute inset-0 opacity-20 blur-md`}
                    />
                    <Icon
                      className={`relative z-10 h-8 w-8 transition-colors duration-500 ${hoveredPhase === index ? 'text-[#bef264]' : 'text-white'}`}
                    />
                  </div>
                </div>

                {/* Card Content - Glassmorphic */}
                <motion.div
                  className={`w-full max-w-lg ${isEven ? 'pr-32' : 'pl-32'}`}
                  whileHover={{ y: -5 }}
                >
                  <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-700 hover:border-white/20 hover:bg-white/[0.07]">
                    <div
                      className={`absolute right-0 top-0 h-32 w-32 ${phase.bgColor} opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-100`}
                    />

                    <div className="relative z-10">
                      <div className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#bef264] opacity-80">
                        Phase {phase.number}
                      </div>
                      <h3 className="mb-3 text-3xl font-black uppercase tracking-tight text-white">
                        {phase.title}
                      </h3>
                      <p
                        className="mb-6 text-lg font-bold italic"
                        style={{ color: phase.accentColor }}
                      >
                        {phase.subtitle}
                      </p>
                      <p className="mb-8 font-medium leading-relaxed text-slate-400">
                        {phase.description}
                      </p>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {phase.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div
                              className="h-1 w-4 rounded-full"
                              style={{ backgroundColor: phase.accentColor }}
                            />
                            <span className="text-sm font-bold text-slate-300">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pointer-events-none absolute -bottom-8 -right-8 select-none text-[12rem] font-black leading-none text-white/[0.02] transition-colors duration-700 group-hover:text-white/[0.04]">
                      {phase.number}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
