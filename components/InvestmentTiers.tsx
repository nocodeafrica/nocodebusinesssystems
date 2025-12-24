'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Briefcase,
  Check,
  Crown,
  Globe,
  Layout,
  Rocket,
  Shield,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

const InvestmentTiers = () => {
  interface Tier {
    name: string;
    icon: any;
    priceRange: string;
    description: string;
    features: string[];
    popular?: boolean;
  }

  interface Category {
    title: string;
    description: string;
    icon: any;
    tiers: Tier[];
  }

  const [activeTab, setActiveTab] = useState<
    'websites' | 'apps' | 'enterprise'
  >('apps');

  const pricingCategories: Record<
    'websites' | 'apps' | 'enterprise',
    Category
  > = {
    websites: {
      title: 'Landing Pages & Sites',
      description: 'High-conversion digital storefronts and marketing assets.',
      icon: Layout,
      tiers: [
        {
          name: 'Starter Site',
          icon: Globe,
          priceRange: 'R3,000 - R10,000',
          description:
            'Professional 1-3 page landing pages or personal websites.',
          popular: false,
          features: [
            'SEO Optimization',
            'Mobile Responsive',
            'Contact Form Integration',
            'Lightning Fast Load Speed',
            '1 Month Support',
          ],
        },
        {
          name: 'Business Site',
          icon: Briefcase,
          priceRange: 'R10,000 - R30,000',
          description:
            'Comprehensive business websites with advanced CMS and styling.',
          popular: true,
          features: [
            'Custom CMS Integration',
            'Advanced Animations',
            'Blog / News Section',
            'Service Showcase',
            '3 Months Support',
          ],
        },
      ],
    },
    apps: {
      title: 'Web & Mobile Apps',
      description: 'Custom-built software engines for business automation.',
      icon: Rocket,
      tiers: [
        {
          name: 'Core System',
          icon: Rocket,
          priceRange: 'R50,000 - R120,000',
          description:
            'MVP development or internal tooling for small businesses.',
          popular: false,
          features: [
            'API Integrations',
            'User Auth & Roles',
            'Database Architecture',
            'Admin Dashboard',
            'Scalable Infrastructure',
          ],
        },
        {
          name: 'Advanced Platform',
          icon: Star,
          priceRange: 'R120,000 - R300,000',
          description:
            'High-performance platforms with complex logic and workflows.',
          popular: true,
          features: [
            'Custom AI Workflows',
            'Real-time Data Processing',
            'Multi-platform Support',
            'Automated Reporting',
            'Priority Scale Support',
          ],
        },
      ],
    },
    enterprise: {
      title: 'Enterprise Systems',
      description: 'Full-scale ecosystem development for industry leaders.',
      icon: Crown,
      tiers: [
        {
          name: 'Bespoke Ecosystem',
          icon: Crown,
          priceRange: 'Custom Quote',
          description:
            'End-to-end digital transformation for large scale operations.',
          popular: true,
          features: [
            'Legacy System Migration',
            'Distributed Architecture',
            'Custom AI Training',
            'White-label System Delivery',
            'Executive Level Support',
          ],
        },
      ],
    },
  };

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-48">
      {/* Premium Background Textures */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[100%] w-[50%] bg-gradient-to-l from-[#bef26405] to-transparent" />
        <div className="absolute bottom-0 left-0 h-[100%] w-[50%] bg-gradient-to-r from-[#bef26408] to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-xl"
          >
            <Star className="h-3 w-3 fill-[#bef264] text-[#bef264]" />
            Strategic Investment
          </motion.div>

          <h2 className="mb-8 text-6xl font-black leading-[0.85] tracking-tight text-slate-900 md:text-8xl">
            ENGINEERING <br />
            <span className="bg-gradient-to-r from-[#bef264] to-[#22c55e] bg-clip-text text-transparent">
              YOUR EDGE
            </span>
          </h2>

          <p className="mx-auto mb-16 max-w-2xl text-xl font-bold leading-relaxed text-slate-500">
            We don't charge for hours. We charge for outcomes. Invest in a
            system that pays for itself in efficiency.
          </p>

          {/* Pricing Tabs */}
          <div className="mb-20 flex flex-wrap justify-center gap-4">
            {(
              Object.keys(pricingCategories) as Array<
                keyof typeof pricingCategories
              >
            ).map((key) => {
              const category = pricingCategories[key];
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`group relative flex items-center gap-3 rounded-2xl border-2 px-8 py-4 transition-all duration-300 ${
                    activeTab === key
                      ? 'border-[#bef264] bg-black text-[#bef264]'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${activeTab === key ? 'text-[#bef264]' : 'text-slate-400 group-hover:text-slate-600'}`}
                  />
                  <span className="text-sm font-black uppercase tracking-widest">
                    {category.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Display active category */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="mb-12 max-w-2xl">
                <p className="text-lg font-medium text-slate-600">
                  {pricingCategories[activeTab].description}
                </p>
              </div>

              <div
                className={`grid w-full gap-8 ${pricingCategories[activeTab].tiers.length === 1 ? 'max-w-md' : 'md:grid-cols-2'}`}
              >
                {pricingCategories[activeTab].tiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    className={`group relative rounded-[3rem] border-2 p-10 text-left ${
                      tier.popular
                        ? 'border-[#bef264] bg-[#bef264]/5'
                        : 'border-slate-100 bg-white'
                    } hover:shadow-3xl shadow-2xl transition-all duration-500`}
                  >
                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-black shadow-lg">
                      <tier.icon className="h-7 w-7 text-[#bef264]" />
                    </div>

                    <h3 className="mb-2 text-2xl font-black uppercase tracking-tight text-slate-900">
                      {tier.name}
                    </h3>

                    <div className="mb-6 font-mono text-3xl font-black tracking-tighter text-slate-900">
                      {tier.priceRange}
                    </div>

                    <p className="mb-8 font-medium leading-relaxed text-slate-500">
                      {tier.description}
                    </p>

                    <div className="mb-10 space-y-4">
                      {tier.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black">
                            <Check className="h-3 w-3 text-[#bef264]" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest shadow-lg transition-all ${
                        tier.popular
                          ? 'bg-black text-white hover:bg-slate-900'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      Book free consulting session
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Proof Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 grid grid-cols-1 gap-12 rounded-[3rem] border border-slate-100 bg-slate-50 p-12 shadow-inner md:grid-cols-3"
          >
            {[
              {
                title: 'Project Delivery',
                desc: 'Transparent milestone tracking with 100% visibility.',
                icon: Check,
              },
              {
                title: 'Risk Mitigation',
                desc: 'Fixed-price contracts that ensure zero budget creep.',
                icon: Shield,
              },
              {
                title: 'ROI Driven',
                desc: 'Systems designed to pay for themselves within 6-12 months.',
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 text-left">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md">
                  <item.icon className="h-6 w-6 text-[#bef264]" />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-black uppercase tracking-tight text-slate-900">
                    {item.title}
                  </h4>
                  <p className="font-medium leading-tight text-slate-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentTiers;
