'use client';

import { motion } from 'framer-motion';

const BookMeetingButton = () => {
  const handleBookMeeting = () => {
    // Smooth scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <motion.button
      onClick={handleBookMeeting}
      className="inline-flex w-auto items-center justify-center rounded-2xl bg-[#bef264] px-8 py-4 font-black uppercase tracking-widest text-black shadow-[0_0_30px_rgba(190,242,100,0.3)] transition-all hover:scale-[1.02] active:scale-95"
      whileHover={{ y: -2 }}
    >
      Book free consultation
    </motion.button>
  );
};

export default BookMeetingButton;
