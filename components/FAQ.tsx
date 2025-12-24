'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  Cog,
  Database,
  HeadphonesIcon,
  Lightbulb,
  Search,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<any[]>([]);

  const faqs = [
    {
      icon: Clock,
      category: 'Timeline',
      question:
        'How long does it typically take to build and deploy a custom business system?',
      answer: `The timeline varies based on complexity and scope, but here's our typical breakdown:

**Startup Tier (Basic Systems):** 6-12 weeks
- Requirements gathering: 1-2 weeks
- Design and development: 3-6 weeks  
- Testing and deployment: 1-2 weeks
- Training and handover: 1-2 weeks

**Small Business Tier:** 3-6 months
- Includes more complex integrations, multiple departments, and advanced features

**Growing Business Tier:** 4-8 months
- Multi-location support, advanced analytics, and custom modules require more development time

**Enterprise Tier:** 6-12+ months
- Fully custom solutions with complex architecture take longer but deliver maximum value

We use agile development methodology, so you'll see working features within the first few weeks, not months. Most clients start seeing operational benefits before the full system is complete.`,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      category: 'Support',
      question:
        "Do I need technical staff to manage and maintain the system after it's built?",
      answer: `No, you don't need technical staff. We design our systems to be managed by business users, not developers.

**What we provide:**
- Intuitive admin interfaces that anyone can learn
- Comprehensive training for your team (included in all packages)
- Detailed documentation and video tutorials
- User-friendly content management systems

**Ongoing maintenance we handle:**
- Server maintenance and security updates
- Software updates and bug fixes
- Performance monitoring and optimization
- Backup management and disaster recovery

**What you control:**
- Adding/editing content and data
- Managing user permissions
- Running reports and analytics
- Basic configuration changes

If you do have technical staff, that's great - we can provide more advanced admin access and training for them. But it's absolutely not required to successfully operate your system.`,
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Database,
      category: 'Migration',
      question:
        'How do you handle data migration from our existing systems and spreadsheets?',
      answer: `Data migration is one of our core specialties. We've migrated everything from simple Excel files to complex legacy databases.

**Our migration process:**
1. **Data Audit:** We analyze your current data structure, quality, and relationships
2. **Migration Strategy:** We create a detailed plan for moving data safely and efficiently  
3. **Data Cleaning:** We identify and fix inconsistencies, duplicates, and formatting issues
4. **Staged Migration:** We migrate in phases, starting with test data, then production
5. **Validation:** We verify all data transferred correctly and nothing was lost

**What we can migrate from:**
- Excel spreadsheets and Google Sheets
- Legacy databases (Access, SQL Server, MySQL, etc.)
- Cloud platforms (Salesforce, HubSpot, QuickBooks, etc.)
- Other business software via APIs or data exports

**Data integrity guarantee:**
- We never work directly on your live systems initially
- Multiple backups are created before any migration
- You approve each phase before we proceed
- We provide detailed migration reports showing what was moved

Most clients are amazed at how much cleaner and more useful their data becomes after migration.`,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Cog,
      category: 'Scalability',
      question:
        'Can the system be modified and expanded as our business grows and changes?',
      answer: `Absolutely. Flexibility and scalability are core design principles in every system we build.

**Built-in flexibility:**
- Modular architecture allows easy addition of new features
- Configurable workflows that you can adjust without coding
- User-defined fields and data structures
- Role-based permissions that scale with your team

**Easy expansions:**
- Add new modules (inventory, HR, projects, etc.)
- Integrate with new software as you adopt it
- Scale to handle more users, data, and locations
- Connect additional departments and processes

**How modifications work:**
- Small changes: Often configurable by you through admin panels
- Medium changes: Quick development sprints (1-2 weeks)
- Major expansions: Planned development phases with clear timelines

**Real examples from our clients:**
- Started with basic CRM, added inventory and accounting modules
- Began single-location, expanded to multi-location with franchise management
- Added e-commerce integration when they launched online sales
- Integrated AI tools as they became available

We actually plan for growth from day one, building systems that can evolve rather than need replacement.`,
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: HeadphonesIcon,
      category: 'Support',
      question:
        'What kind of ongoing support do you provide, and what happens if something breaks?',
      answer: `We provide comprehensive ongoing support because we know your business can't afford downtime.

**Included support (varies by tier):**
- **Startup:** 3 months of priority support
- **Small Business:** 6 months of priority support  
- **Growing Business:** 12 months of priority support
- **Enterprise:** Dedicated support team with SLA guarantees

**What's covered:**
- Bug fixes and technical issues (always free)
- System monitoring and performance optimization
- Security updates and patches
- Backup management and disaster recovery
- User training and refresher sessions

**Response times:**
- Critical issues (system down): 1-4 hours
- High priority (major features broken): Same business day
- Medium priority (minor issues): 24-48 hours
- Low priority (questions, training): 2-3 business days

**Extended support options:**
- Monthly maintenance plans for ongoing feature development
- On-call support for mission-critical operations
- Training programs for new staff members
- System health reports and optimization recommendations

**What if something breaks?**
We take full responsibility. If it's our code, we fix it for free, period. Most issues are resolved quickly because we build robust, well-tested systems and monitor them proactively.`,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Lightbulb,
      category: 'Decision',
      question:
        'Should I choose a custom solution over off-the-shelf software like Salesforce or Monday.com?',
      answer: `Great question - and it depends on your specific situation. Here's our honest assessment:

**Choose off-the-shelf when:**
- Your processes fit standard business models
- You don't mind changing how you work to fit the software
- You have budget for monthly subscriptions plus add-ons
- You don't need many customizations

**Choose custom when:**
- Your business processes are unique or complex
- Off-the-shelf solutions force uncomfortable compromises  
- You want to own your system, not rent it
- Integration costs for multiple tools add up to custom pricing
- You need specific features that don't exist in standard software

**Cost comparison reality:**
Off-the-shelf seems cheaper upfront, but consider:
- Monthly subscriptions: $50-200+ per user per month
- Add-on costs for extra features
- Integration costs between multiple tools
- Customization and consulting fees
- Data export fees if you ever want to switch

A custom system often costs less over 2-3 years and provides infinitely more value.

**Our recommendation:**
Start with our Startup tier if you're unsure. We can often build a basic custom system for less than 2 years of premium off-the-shelf subscriptions, and you'll own it forever.

Many of our best clients tried off-the-shelf first and came to us when they outgrew the limitations.`,
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  useEffect(() => {
    if (searchTerm) {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs(faqs);
    }
  }, [searchTerm]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#020617] py-24 md:py-48"
    >
      {/* Cinematic Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#bef26405] blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-[#bef26405] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16 text-center md:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-block rounded-full border border-[#bef26433] bg-[#bef2641a] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#bef264]"
          >
            Capabilities & Support
          </motion.div>

          <h2 className="mb-8 text-5xl font-black uppercase leading-tight tracking-tight text-white md:text-7xl">
            Frequently <br />
            <span className="bg-gradient-to-r from-[#bef264] to-[#f7fee7] bg-clip-text text-transparent">
              Asked Questions
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-xl font-medium text-slate-400">
            Everything you need to know about engineering your business for the
            future.
          </p>
        </motion.div>

        {/* Search Bar - Premium Deep Dark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mx-auto mb-16 max-w-2xl"
        >
          <div className="group relative">
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[#bef264]" />
            <input
              type="text"
              placeholder="Search concepts, timelines, or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-[2rem] border border-white/10 bg-white/[0.03] py-6 pl-16 pr-6 font-medium text-white shadow-2xl transition-all placeholder:text-slate-600 focus:border-[#bef264]/50 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* FAQ Items */}
        <div className="mx-auto max-w-4xl space-y-6">
          <AnimatePresence mode="wait">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`overflow-hidden rounded-[2rem] border bg-white/[0.02] transition-all ${openIndex === index ? 'border-[#bef26433] bg-white/[0.04]' : 'border-white/5 hover:border-white/10'}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="group flex w-full items-center justify-between px-8 py-8 text-left"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all ${openIndex === index ? 'bg-[#bef264] text-black shadow-[0_0_20px_rgba(190,242,100,0.4)]' : 'bg-white/5 text-[#bef264]'}`}
                    >
                      <faq.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#bef264]/60">
                        {faq.category}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#bef264]">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${openIndex === index ? 'rotate-180 border-[#bef264] text-[#bef264]' : 'border-white/10 text-slate-500'}`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.04, 0.62, 0.23, 0.98],
                      }}
                    >
                      <div className="px-8 pb-8 pl-[6.5rem]">
                        <div className="prose prose-invert prose-slate max-w-none">
                          {faq.answer
                            .split('\n')
                            .map((paragraph: string, pIndex: number) => (
                              <p
                                key={pIndex}
                                className="mb-4 text-lg leading-relaxed text-slate-400 last:mb-0"
                              >
                                {paragraph
                                  .split('**')
                                  .map((part: string, i: number) =>
                                    i % 2 === 0 ? (
                                      part
                                    ) : (
                                      <strong
                                        key={i}
                                        className="font-bold text-[#bef264]"
                                      >
                                        {part}
                                      </strong>
                                    )
                                  )}
                              </p>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
