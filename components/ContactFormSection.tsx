'use client';

import { motion } from 'framer-motion';
import {
  Building,
  Check,
  FileText,
  Loader,
  Mail,
  MapPin,
  Send,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface FormData {
  fullName: string;
  email: string;
  company: string;
  city: string;
  description: string;
}

const ContactFormSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    company: '',
    city: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email';
    if (!formData.company.trim()) newErrors.company = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.description.trim()) newErrors.description = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const edgeFunctionUrl =
        'https://sjbvvrjxsbqrgtpgdxwr.supabase.co/functions/v1/send-contact-email';
      const supabaseAnonKey =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqYnZ2cmp4c2Jxcmd0cGdkeHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyODQ0MjMsImV4cCI6MjA3MDg2MDQyM30.mOYjs0lthdz-OngKoVSiQsHWZYChLWD2fwZT4uKg0hQ';
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          fullName: '',
          email: '',
          company: '',
          city: '',
          description: '',
        });
      }, 5000);
    } catch (error) {
      console.error(error);
      alert('Error submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#020617] py-24 md:py-48"
    >
      {/* Cinematic Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bef26405] blur-[150px]" />
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_10%_10%,#bef26405,transparent_50%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-24 lg:flex-row">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-8 inline-block rounded-full border border-[#bef26433] bg-[#bef2641a] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#bef264]"
            >
              Connect with Horizon
            </motion.div>

            <h2 className="mb-10 text-6xl font-black uppercase leading-[0.85] tracking-tight text-white md:text-8xl">
              Build <br />
              <span className="bg-gradient-to-r from-[#bef264] to-[#f7fee7] bg-clip-text text-transparent">
                The Future
              </span>{' '}
              <br />
              With Us.
            </h2>

            <p className="mb-12 max-w-xl text-2xl font-medium leading-relaxed text-slate-400">
              Stop solving the same problems manually. Let's engineer a system
              that solves them forever.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  label: 'Direct Access',
                  value: 'hello@horizon.systems',
                },
                {
                  icon: MapPin,
                  label: 'HQ Location',
                  value: 'Cape Town, South Africa',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-6 lg:justify-start"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#bef264]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#bef264]">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="shadow-3xl w-full flex-1 rounded-[3.5rem] border border-white/10 bg-white/[0.02] p-2 backdrop-blur-2xl"
          >
            <div className="rounded-[3rem] border border-white/5 bg-[#020617] p-8 md:p-12">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center"
                >
                  <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#bef264]/10">
                    <Check className="h-12 w-12 text-[#bef264]" />
                  </div>
                  <h3 className="mb-4 text-3xl font-black uppercase tracking-tight text-white">
                    Request Received
                  </h3>
                  <p className="text-lg font-medium text-slate-400">
                    We'll be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      {
                        id: 'fullName',
                        label: 'Full Name',
                        icon: User,
                        placeholder: 'John Doe',
                      },
                      {
                        id: 'email',
                        label: 'Work Email',
                        icon: Mail,
                        placeholder: 'john@company.com',
                      },
                      {
                        id: 'company',
                        label: 'Company',
                        icon: Building,
                        placeholder: 'Acme Corp',
                      },
                      {
                        id: 'city',
                        label: 'City',
                        icon: MapPin,
                        placeholder: 'Cape Town',
                      },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="mb-2 ml-1 block text-xs font-black uppercase tracking-widest text-slate-500">
                          {field.label}
                        </label>
                        <div className="group relative">
                          <field.icon
                            className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${errors[field.id as keyof FormData] ? 'text-red-400' : 'text-slate-500 group-focus-within:text-[#bef264]'}`}
                          />
                          <input
                            type={field.id === 'email' ? 'email' : 'text'}
                            name={field.id}
                            value={formData[field.id as keyof FormData]}
                            onChange={handleInputChange}
                            className={`w-full border bg-white/5 ${errors[field.id as keyof FormData] ? 'border-red-500/50' : 'border-white/10 focus:border-[#bef264]/50'} rounded-2xl py-4 pl-12 pr-4 font-medium text-white outline-none transition-all`}
                            placeholder={field.placeholder}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="mb-2 ml-1 block text-xs font-black uppercase tracking-widest text-slate-500">
                      Project Brief
                    </label>
                    <div className="group relative">
                      <FileText
                        className={`absolute left-4 top-5 h-4 w-4 transition-colors ${errors.description ? 'text-red-400' : 'text-slate-500 group-focus-within:text-[#bef264]'}`}
                      />
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full border bg-white/5 ${errors.description ? 'border-red-500/50' : 'border-white/10 focus:border-[#bef264]/50'} resize-none rounded-2xl py-4 pl-12 pr-4 font-medium text-white outline-none transition-all`}
                        placeholder="Tell us about your challenges..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bef264] px-4 py-3 text-[10px] font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(190,242,100,0.2)] transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:gap-3 md:rounded-2xl md:px-8 md:py-5 md:text-sm md:tracking-[0.2em] md:shadow-[0_0_30px_rgba(190,242,100,0.3)]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin md:h-5 md:w-5" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Send className="hidden h-5 w-5 md:block" />
                        <span className="md:hidden">Book Session</span>
                        <span className="hidden md:inline">
                          Book free consulting session
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
