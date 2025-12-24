'use client';

import { motion } from 'framer-motion';
import { Layers, ShieldAlert, Zap } from 'lucide-react';

const TheProblem = () => {
  const problems = [
    {
      title: 'Data Silos & Fragmentation',
      description:
        'Critical business data locked in isolated systems, preventing a single source of truth and hindering decisive action.',
      icon: Layers,
      color: 'from-[#bef264] to-[#a3d936]',
    },
    {
      title: 'Manual Workflow Bottlenecks',
      description:
        "Human-intensive processes that don't scale, leading to increased overhead, frequent errors, and operational fatigue.",
      icon: Zap,
      color: 'from-[#d9f99d] to-[#bef264]',
    },
    {
      title: 'Technological Stagnation',
      description:
        'Legacy infrastructure that acts as an anchor, preventing rapid adaptation to market shifts and emerging AI opportunities.',
      icon: ShieldAlert,
      color: 'from-[#f7fee7] to-[#d9f99d]',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#020617] py-24 md:py-40">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-[#bef26405] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <div className="mb-8 inline-block rounded-full border border-[#bef26433] bg-[#bef2641a] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#bef264]">
            The Status Quo
          </div>

          <h2 className="mb-10 text-4xl font-black leading-[0.85] tracking-tighter text-white md:text-8xl">
            INEFFICIENCY IS THE <br />
            <span className="bg-gradient-to-r from-[#bef264] to-[#d9f99d] bg-clip-text text-transparent">
              SILENT KILLER
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-slate-400">
            Generic software creates more problems than it solves. We identify
            the friction points that are holding your business back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative h-full"
            >
              <div className="h-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-sm transition-all duration-500 hover:bg-white/10">
                <div
                  className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${problem.color} mb-10 flex items-center justify-center shadow-[0_0_20px_rgba(190,242,100,0.2)]`}
                >
                  <problem.icon className="h-8 w-8 text-black" />
                </div>

                <h3 className="mb-6 text-3xl font-bold tracking-tight text-white">
                  {problem.title}
                </h3>

                <p className="font-medium leading-relaxed text-slate-400">
                  {problem.description}
                </p>

                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-[#bef26410] opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
