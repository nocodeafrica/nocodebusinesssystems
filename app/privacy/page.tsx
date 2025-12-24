'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      {/* Cinematic Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[#bef264]/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[800px] rounded-full bg-indigo-500/5 blur-[120px]" />
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
              <Shield className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">
                Legal Document
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              Privacy{' '}
              <span className="bg-gradient-to-r from-[#bef264] to-white bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-400">
              We value your trust. Here is how we protect and manage your
              personal data.
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
                <span className="text-[#bef264]">01.</span> Introduction
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-400">
                <p>
                  Horizon Systems ("we", "our", or "us") respects your privacy
                  and is committed to protecting your personal data. This
                  privacy policy will inform you about how we look after your
                  personal data when you visit our website and tell you about
                  your privacy rights.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">02.</span> Information We
                Collect
              </h2>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-[#bef264]/30">
                <p className="mb-4">
                  We may collect, use, store and transfer different kinds of
                  personal data about you:
                </p>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    'Identity Data: first name, last name',
                    'Contact Data: email address, telephone',
                    'Technical Data: IP address, browser info',
                    'Usage Data: interaction metrics',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#bef264]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">03.</span> Usage of Information
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-400">
                <p>
                  We will only use your personal data when the law allows us to.
                  Most commonly, we will use your personal data to:
                </p>
                <ul className="mt-4 list-none space-y-2 pl-0">
                  {[
                    'Provide and maintain our services',
                    'Notify you about changes',
                    'Provide customer support',
                    'Improve our algorithms',
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
                <span className="text-[#bef264]">04.</span> Data Security
              </h2>
              <p className="text-lg leading-relaxed">
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used or
                accessed in an unauthorised way. We limit access to your
                personal data to those employees, agents, contractors who have a
                strict business need to know.
              </p>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">05.</span> Your Rights
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  'Request access to data',
                  'Request correction',
                  'Request erasure',
                  'Object to processing',
                  'Request restriction',
                  'Right to withdraw consent',
                ].map((right, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/5 bg-white/5 p-4 text-center transition-colors hover:bg-white/10"
                  >
                    <span className="text-sm font-bold text-white">
                      {right}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-white/10 pt-8">
              <h2 className="mb-4 text-xl font-bold text-white">Questions?</h2>
              <p className="mb-6">
                If you have any questions about this privacy policy, please
                contact us.
              </p>
              <Link
                href="/#contact"
                className="inline-block rounded-xl bg-[#bef264] px-8 py-4 font-black uppercase tracking-widest text-black transition-transform hover:scale-105"
              >
                Contact Support
              </Link>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
