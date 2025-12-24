'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function DataProtection() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      {/* Cinematic Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[#bef264]/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[800px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-[#bef264]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#bef264]/20 bg-[#bef264]/10 px-4 py-2 text-[#bef264]">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">
                Security Protocol
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              Data{' '}
              <span className="bg-gradient-to-r from-[#bef264] to-white bg-clip-text text-transparent">
                Protection
              </span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-400">
              Our comprehensive approach to securing your critical business
              data.
            </p>
            <p className="mt-4 font-mono text-sm text-slate-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-16"
          >
            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">01.</span> Our Philosophy
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-400">
                <p>
                  At Horizon Systems, data protection isn't an afterthought—it's
                  engineered into the core of our systems. We employ bank-grade
                  security protocols to ensure your proprietary algorithms and
                  customer data remain sovereign and secure.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">02.</span> Encryption Standards
              </h2>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-[#bef264]/30">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-white">
                      At Rest
                    </h3>
                    <p className="text-sm text-slate-400">
                      AES-256 encryption for all stored data, ensuring that even
                      in the unlikely event of physical theft, your data remains
                      unreadable.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-white">
                      In Transit
                    </h3>
                    <p className="text-sm text-slate-400">
                      TLS 1.3 for all data in motion, preventing interception
                      and tampering during transmission across networks.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">03.</span> Access Control
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-400">
                <p>
                  We implement strict Role-Based Access Control (RBAC) and
                  Principle of Least Privilege (PoLP). Access to production data
                  is restricted to authorized personnel only and is audited
                  regularly.
                </p>
                <ul className="mt-4 list-none space-y-2 pl-0">
                  {[
                    'Multi-Factor Authentication (MFA) enforce',
                    'Regular security audits',
                    'Automated threat detection',
                    'Incident response teams',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 text-[#bef264]">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">04.</span> Compliance
              </h2>
              <p className="text-lg leading-relaxed">
                We are committed to complying with global data protection
                regulations, including GDPR, CCPA, and others relevant to our
                jurisdictions of operation.
              </p>
            </section>

            <section className="border-t border-white/10 pt-8">
              <h2 className="mb-4 text-xl font-bold text-white">
                Security Concern?
              </h2>
              <p className="mb-6">
                If you believe you have found a security vulnerability, please
                report it to us immediately.
              </p>
              <Link
                href="/#contact"
                className="inline-block rounded-xl bg-[#bef264] px-8 py-4 font-black uppercase tracking-widest text-black transition-transform hover:scale-105"
              >
                Report Issue
              </Link>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
