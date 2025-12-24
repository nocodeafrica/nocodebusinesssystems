'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300">
      {/* Cinematic Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[#bef264]/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[800px] rounded-full bg-sky-500/5 blur-[120px]" />
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
              <Scale className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">
                Legal Agreement
              </span>
            </div>
            <h1 className="mb-6 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              Terms of{' '}
              <span className="bg-gradient-to-r from-[#bef264] to-white bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-400">
              The rules and regulations for the use of Horizon Systems' Website.
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
                <span className="text-[#bef264]">01.</span> Agreement to Terms
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-400">
                <p>
                  By accessing this website we assume you accept these terms and
                  conditions. Do not continue to use Horizon Systems if you do
                  not agree to take all of the terms and conditions stated on
                  this page.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">02.</span> Intellectual
                Property
              </h2>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-[#bef264]/30">
                <p className="mb-4 text-slate-400">
                  Unless otherwise stated, Horizon Systems and/or its licensors
                  own the intellectual property rights for all material on
                  Horizon Systems. All intellectual property rights are
                  reserved. You may access this from Horizon Systems for your
                  own personal use subjected to restrictions set in these terms
                  and conditions.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-red-500">
                      You must not:
                    </span>
                    Republish material
                  </div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-red-500">
                      You must not:
                    </span>
                    Sell, rent or sub-license material
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-6 flex items-center gap-4 text-2xl font-black uppercase tracking-widest text-white">
                <span className="text-[#bef264]">03.</span> Disclaimer
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-slate-400">
                <p>
                  To the maximum extent permitted by applicable law, we exclude
                  all representations, warranties and conditions relating to our
                  website and the use of this website. Nothing in this
                  disclaimer will:
                </p>
                <ul className="mt-4 list-none space-y-2 pl-0">
                  {[
                    'Limit or exclude our or your liability for death or personal injury',
                    'Limit or exclude our or your liability for fraud',
                    'Limit any of our or your liabilities in any way that is not permitted under applicable law',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1.5 text-[#bef264]">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="border-t border-white/10 pt-8">
              <h2 className="mb-4 text-xl font-bold text-white">Questions?</h2>
              <p className="mb-6">
                If you have any questions about these Terms of Service, please
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
