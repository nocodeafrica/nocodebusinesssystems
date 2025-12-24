'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, Shield } from 'lucide-react';

const GetStarted = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const trustIndicators = [
    {
      icon: Clock,
      title: '2-week first demo',
      description: 'See your solution in action quickly',
    },
    {
      icon: Shield,
      title: '6-month ROI guarantee',
      description: 'We guarantee measurable returns',
    },
    {
      icon: CheckCircle,
      title: '24/7 dedicated support',
      description: 'Always here when you need us',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#020617] py-24 md:py-48">
      {/* Cinematic Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bef26405] blur-[150px]" />
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#bef26410,transparent_70%)]"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12 inline-flex items-center gap-3 rounded-full border border-[#bef26433] bg-[#bef2641a] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#bef264]"
          >
            <div className="h-2 w-2 animate-ping rounded-full bg-[#bef264]" />
            Engineering Your Competitive Advantage
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12 text-6xl font-black uppercase leading-[0.85] tracking-tight text-white md:text-9xl"
          >
            Build <br />
            <span className="bg-gradient-to-r from-[#bef264] to-[#f7fee7] bg-clip-text text-transparent">
              Greatness.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mx-auto mb-16 max-w-3xl text-2xl font-medium leading-relaxed text-slate-400"
          >
            Stop settling for generic software. Partner with us to engineer
            high-performance systems that drive exponential growth.
          </motion.p>

          <div className="mb-24 flex flex-col justify-center gap-8 md:flex-row">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToContact}
              // Mobile-optimized button with no icons
              className="group relative overflow-hidden rounded-xl bg-[#bef264] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(190,242,100,0.2)] transition-all md:rounded-2xl md:px-12 md:py-6 md:text-lg md:shadow-[0_0_50px_rgba(190,242,100,0.3)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-4">
                Book free consultation
              </span>
            </motion.button>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 pb-12 md:grid-cols-3">
            {trustIndicators.map((indicator, index) => {
              const Icon = indicator.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-[#bef264] shadow-xl transition-all group-hover:scale-110 group-hover:bg-[#bef264] group-hover:text-black">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h4 className="mb-2 text-lg font-black uppercase tracking-tight text-white">
                    {indicator.title}
                  </h4>
                  <p className="font-medium text-slate-500">
                    {indicator.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
