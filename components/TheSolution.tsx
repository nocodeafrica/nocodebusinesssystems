'use client';

import { motion } from 'framer-motion';
import { Brain, Globe, Layers, Shield, TrendingUp, Zap } from 'lucide-react';
import { useRef } from 'react';

const TheSolution = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Brain,
      title: 'AI-Native Systems',
      description:
        'Custom-built with AI integration as a core requirement, not an afterthought.',
      gradient: 'from-[#bef264] to-[#a3d936]',
      glow: 'bg-[#bef264]/10',
    },
    {
      icon: TrendingUp,
      title: 'Engineered for Scale',
      description:
        'Elastic architectures that grow seamlessly with your business ambitions.',
      gradient: 'from-[#d9f99d] to-[#bef264]',
      glow: 'bg-[#d9f99d]/10',
    },
    {
      icon: Zap,
      title: 'Rapid Deployment',
      description:
        'Proprietary modules that cut development time by 70% without sacrificing quality.',
      gradient: 'from-[#f7fee7] to-[#d9f99d]',
      glow: 'bg-[#f7fee7]/10',
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description:
        'Fortified by enterprise-standard encryption and secure-by-design patterns.',
      gradient: 'from-[#bef264] to-[#d9f99d]',
      glow: 'bg-[#bef264]/10',
    },
    {
      icon: Layers,
      title: 'Modular Freedom',
      description:
        'Decoupled systems that allow for modular expansion as your needs evolve.',
      gradient: 'from-[#d9f99d] to-[#f7fee7]',
      glow: 'bg-[#d9f99d]/10',
    },
    {
      icon: Globe,
      title: 'Global Resilience',
      description:
        'Built for worldwide performance with multi-region compliance and support.',
      gradient: 'from-[#f7fee7] to-[#bef264]',
      glow: 'bg-[#f7fee7]/10',
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#020617] py-24 md:py-40"
    >
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#bef26405] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#d9f99d05] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <div className="mb-6 inline-block rounded-full border border-[#bef26433] bg-[#bef2641a] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#bef264]">
            The Horizon Advantage
          </div>

          <h2 className="mb-8 text-4xl font-bold tracking-tight text-white md:text-7xl">
            Built for{' '}
            <span className="bg-gradient-to-r from-[#bef264] to-[#f7fee7] bg-clip-text text-transparent">
              exponential growth
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-slate-400">
            We don't just build apps; we engineer business engines that enable
            you to scale beyond your current horizon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-full"
            >
              <div className="h-full rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/10">
                <div
                  className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-8 flex items-center justify-center border border-white/5 p-3 shadow-[0_0_20px_rgba(190,242,100,0.1)]`}
                >
                  <feature.icon className="h-full w-full text-black" />
                </div>

                <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">
                  {feature.title}
                </h3>

                <p className="font-medium leading-relaxed text-slate-400">
                  {feature.description}
                </p>

                <div
                  className={`absolute inset-0 rounded-[2rem] ${feature.glow} pointer-events-none opacity-0 transition-opacity group-hover:opacity-100`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TheSolution;
