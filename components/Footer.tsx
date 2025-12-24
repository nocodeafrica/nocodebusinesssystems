'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const company = [
    {
      name: 'Home',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    { name: 'Our Work', action: () => scrollToSection('our-work') },
    { name: 'Problem & Solution', action: () => scrollToSection('problem') },
    { name: 'How We Work', action: () => scrollToSection('how-we-work') },
    { name: 'Pricing', action: () => scrollToSection('pricing') },
    { name: 'FAQ', action: () => scrollToSection('faq') },
    { name: 'Contact', action: () => scrollToSection('contact') },
  ];

  const selectSystemAndScroll = (systemId: string) => {
    // Dispatch custom event to select the system
    window.dispatchEvent(
      new CustomEvent('selectSystem', { detail: { systemId } })
    );
    // Scroll to the section
    scrollToSection('our-work');
  };

  const showcase = [
    { name: 'Voice Systems', action: () => selectSystemAndScroll('voice') },
    {
      name: 'Location Systems',
      action: () => selectSystemAndScroll('location'),
    },
    { name: '3D Systems', action: () => selectSystemAndScroll('3d') },
    {
      name: 'Analytics Systems',
      action: () => selectSystemAndScroll('analytics'),
    },
    {
      name: 'People Management',
      action: () => selectSystemAndScroll('people'),
    },
    {
      name: 'Inventory Management',
      action: () => selectSystemAndScroll('inventory'),
    },
    {
      name: 'Recruitment Systems',
      action: () => selectSystemAndScroll('recruitment'),
    },
    { name: 'Legal Tech', action: () => selectSystemAndScroll('legal') },
    { name: 'Real Estate', action: () => selectSystemAndScroll('realestate') },
    {
      name: 'Healthcare Systems',
      action: () => selectSystemAndScroll('healthcare'),
    },
    {
      name: 'Hospitality Systems',
      action: () => selectSystemAndScroll('hospitality'),
    },
    {
      name: 'Education Systems',
      action: () => selectSystemAndScroll('education'),
    },
  ];

  const legal = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Data Protection', href: '/data-protection' },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#020617]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[#bef26405] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="py-24">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-5">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <Image
                src="/Horizon Systems Horizontal Alpha.svg"
                alt="Horizon Systems"
                width={220}
                height={60}
                className="mb-8 opacity-90 brightness-0 invert"
              />
              <p className="mb-10 max-w-sm text-xl font-medium leading-relaxed text-slate-400">
                Building high-performance business systems that streamline
                operations and accelerate growth.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders if needed */}
              </div>
            </motion.div>

            {/* Navigation */}
            {[
              { title: 'Company', items: company },
              { title: 'Showcase', items: showcase.slice(0, 6) },
              { title: 'Legal', items: legal },
            ].map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx + 1) }}
              >
                <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-[#bef264]">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.items.map((item: any, i: number) => (
                    <li key={i}>
                      {'action' in item ? (
                        <button
                          onClick={item.action}
                          className="group flex items-center text-sm font-bold text-slate-500 transition-all hover:text-white"
                        >
                          <ArrowRight className="mr-3 h-3 w-3 -translate-x-2 text-[#bef264] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="group flex items-center text-sm font-bold text-slate-500 transition-all hover:text-white"
                        >
                          <ArrowRight className="mr-3 h-3 w-3 -translate-x-2 text-[#bef264] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 py-12 md:flex-row">
          <p className="text-xs font-black uppercase tracking-widest text-slate-600">
            © {currentYear} Horizon Systems. Engineered for Excellence.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
              Cape Town • South Africa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
