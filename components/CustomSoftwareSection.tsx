'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import BookMeetingButton from './BookMeetingButton';

const CustomSoftwareSection = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check the element at the center-top of the viewport (under the navbar)
      // Using 50px offset to detect what's behind the navbar mid-point
      const elements = document.elementsFromPoint(window.innerWidth / 2, 50);

      // Find the first element that is NOT part of the navbar
      const contentElement = elements.find((el) => !el.closest('nav'));

      // Find the theme of that content element
      const theme = contentElement
        ?.closest('[data-theme]')
        ?.getAttribute('data-theme');

      // If we found a light section, switch to light mode
      setIsScrolled(theme === 'light');
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Dynamic Technical Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Technical Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#bef2641a 1.5px, transparent 1.5px), linear-gradient(90deg, #bef2641a 1.5px, transparent 1.5px)`,
            backgroundSize: '60px 60px',
            maskImage:
              'radial-gradient(circle at 50% 50%, black, transparent 80%)',
          }}
        />

        {/* Centered Organic Glows */}
        <div className="absolute left-1/2 top-[20%] h-[600px] w-[600px] -translate-x-1/2 animate-pulse rounded-full bg-[#bef26408] blur-[120px]" />
        <div className="absolute bottom-[10%] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#bef26405] blur-[100px]" />

        {/* Floating Technical Elements - Discrete */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                y: [0, -40, 0],
                x: [0, 20, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute h-px w-24 bg-gradient-to-r from-transparent via-[#bef264] to-transparent"
              style={{
                top: `${20 + i * 12}%`,
                left: `${15 + i * 15}%`,
                transform: 'rotate(-45deg)',
              }}
            />
          ))}
        </div>

        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed left-0 top-0 z-50 w-full px-6 py-8 transition-all duration-300">
        <div className="container mx-auto">
          <div
            className={`flex items-center justify-between rounded-[2rem] border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isScrolled
                ? 'border-slate-200 bg-white/90'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3 pl-4">
              <Image
                src={
                  isScrolled
                    ? '/Horizon Systems Horizontal Normal.svg'
                    : '/Horizon Systems Horizontal Alpha.svg'
                }
                alt="Horizon Systems"
                width={400}
                height={90}
                className={`h-20 w-auto transition-all duration-300 ${
                  isScrolled ? '' : 'brightness-0 invert'
                }`}
              />
            </div>

            <div className="hidden items-center gap-8 md:flex">
              {['Solutions', 'Process', 'Systems', 'Investment'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#bef264] ${
                    isScrolled ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden pr-4 md:block">
              <BookMeetingButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content - Centered */}
      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-6 pt-32 text-center md:pt-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-7xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-block rounded-full border border-[#bef26433] bg-[#bef2641a] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#bef264]"
          >
            Precision Engineering for Business
          </motion.div>

          <h1 className="mb-10 text-5xl font-black leading-[0.9] tracking-tight text-white md:text-7xl lg:text-8xl">
            WE BUILD INTELLIGENT <br />
            <span className="bg-gradient-to-r from-white to-[#bef264] bg-clip-text text-transparent">
              BUSINESS SYSTEMS.
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-lg font-medium leading-relaxed text-slate-400 md:text-xl">
            We don't just build software. We build high-performance business
            ecosystems that streamline operations and accelerate growth.
          </p>

          <div className="flex flex-col items-center gap-12">
            <BookMeetingButton />

            <div className="flex flex-col items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-12 rounded-full border-2 border-[#020617] bg-slate-800 shadow-xl"
                  />
                ))}
              </div>
              <div className="text-center text-sm">
                <p className="font-bold uppercase tracking-widest text-white">
                  Trusted by 50+ Global Leaders
                </p>
                <p className="font-medium text-[#bef264]/60">
                  World-class delivery across high-impact industries
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vertical Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <div className="h-12 w-px bg-gradient-to-b from-[#bef264] to-transparent" />
          <span className="vertical-text text-[10px] font-black uppercase tracking-[0.3em] text-[#bef264]">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomSoftwareSection;
