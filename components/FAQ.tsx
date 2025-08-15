'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Clock, Users, Database, Cog, HeadphonesIcon, Lightbulb, ChevronDown, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredFaqs, setFilteredFaqs] = useState<any[]>([])

  const faqs = [
    {
      icon: Clock,
      category: 'Timeline',
      question: 'How long does it typically take to build and deploy a custom business system?',
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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      category: 'Support',
      question: 'Do I need technical staff to manage and maintain the system after it\'s built?',
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
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Database,
      category: 'Migration',
      question: 'How do you handle data migration from our existing systems and spreadsheets?',
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
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Cog,
      category: 'Scalability',
      question: 'Can the system be modified and expanded as our business grows and changes?',
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
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: HeadphonesIcon,
      category: 'Support',
      question: 'What kind of ongoing support do you provide, and what happens if something breaks?',
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
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Lightbulb,
      category: 'Decision',
      question: 'Should I choose a custom solution over off-the-shelf software like Salesforce or Monday.com?',
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
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  useEffect(() => {
    if (searchTerm) {
      const filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredFaqs(filtered)
    } else {
      setFilteredFaqs(faqs)
    }
  }, [searchTerm])

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <span className="inline-block px-4 md:px-6 py-2 bg-white border border-gray-200 text-gray-800 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
            Common Questions
          </span>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-gray-900 leading-tight">
            Frequently Asked
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
              Questions
            </span>
          </h2>
          
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Everything you need to know about working with us. 
            <span className="hidden md:inline"> Can't find what you're looking for? Schedule a call and we'll answer directly.</span>
          </p>
        </motion.div>

        {/* Search Bar - Mobile Optimized */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-gray-200 rounded-xl md:rounded-2xl shadow-sm focus:shadow-md focus:border-blue-500 focus:outline-none transition-all text-sm md:text-base"
            />
          </div>
        </motion.div>

        {/* Category Pills - Mobile Horizontal Scroll */}
        <div className="mb-6 md:mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 md:gap-3 md:justify-center min-w-max md:min-w-0">
            <button
              onClick={() => setSearchTerm('')}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                !searchTerm ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              All Questions
            </button>
            {['Timeline', 'Support', 'Migration', 'Scalability', 'Decision'].map(category => (
              <button
                key={category}
                onClick={() => setSearchTerm(category)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  searchTerm === category ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion - Mobile Optimized */}
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Question Header - Mobile Optimized Touch Target */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 md:p-6 text-left hover:bg-gray-50 transition-colors flex items-start md:items-center justify-between group min-h-[80px] md:min-h-0"
                >
                  <div className="flex items-start md:items-center flex-1 pr-3">
                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${faq.color} rounded-lg md:rounded-xl flex items-center justify-center shadow-sm mr-3 md:mr-4 flex-shrink-0`}>
                      <faq.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 font-medium md:hidden">{faq.category}</span>
                      <h3 className="text-sm md:text-lg font-semibold text-gray-900 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  
                  <motion.div 
                    className="flex-shrink-0 ml-2"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>
                
                {/* Answer Content - Mobile Optimized */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 md:px-6 md:pb-6">
                        <div className="md:pl-16">
                          <div className="bg-gradient-to-br from-gray-50 to-gray-50/50 rounded-lg p-4 md:p-6 border border-gray-100">
                            {faq.answer.split('\n').map((paragraph, i) => {
                              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                return (
                                  <h4 key={i} className="font-semibold text-gray-900 mt-3 md:mt-4 mb-2 first:mt-0 text-sm md:text-base">
                                    {paragraph.replace(/\*\*/g, '')}
                                  </h4>
                                )
                              } else if (paragraph.startsWith('- ')) {
                                return (
                                  <div key={i} className="flex items-start mb-2">
                                    <div className={`w-1.5 h-1.5 bg-gradient-to-r ${faq.color} rounded-full mt-1.5 md:mt-2 mr-2 md:mr-3 flex-shrink-0`} />
                                    <span className="text-gray-700 text-xs md:text-sm leading-relaxed">
                                      {paragraph.substring(2)}
                                    </span>
                                  </div>
                                )
                              } else if (paragraph.match(/^\d+\.\s/)) {
                                const [number, ...rest] = paragraph.split(' ')
                                return (
                                  <div key={i} className="flex items-start mb-2">
                                    <span className="font-semibold text-gray-900 mr-2 text-xs md:text-sm">{number}</span>
                                    <span className="text-gray-700 text-xs md:text-sm leading-relaxed">
                                      {rest.join(' ')}
                                    </span>
                                  </div>
                                )
                              } else if (paragraph.trim()) {
                                return (
                                  <p key={i} className="text-gray-700 mb-3 text-xs md:text-sm leading-relaxed">
                                    {paragraph}
                                  </p>
                                )
                              }
                              return null
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg">No questions found matching your search.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </div>

        {/* CTA Section - Mobile Optimized */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
              Still Have Questions?
            </h3>
            
            <p className="text-sm md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Every business is unique. Book a free consultation to get personalized answers.
            </p>
            
            <button className="w-full md:w-auto px-6 md:px-8 py-3 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 text-sm md:text-base">
              Schedule Your Free Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ