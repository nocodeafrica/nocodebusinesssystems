'use client';

import { motion } from 'framer-motion';

const OurTeam = () => {
  const team = [
    {
      name: 'Sarah Ngozi',
      role: 'Managing Director',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    {
      name: 'James Okonkwo',
      role: 'Director of Technology',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      name: 'Amara Dlamini',
      role: 'Director of Operations',
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    },
    {
      name: 'Michael Adeyemi',
      role: 'Director of Marketing',
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    },
  ];

  return (
    <section
      id="team"
      className="relative overflow-hidden bg-[#020617] py-24 md:py-48"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#bef26403] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-24 text-center"
        >
          <div className="mb-8 inline-block rounded-full border border-[#bef26433] bg-[#bef2641a] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#bef264]">
            Expert Engineering
          </div>
          <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-tight text-white md:text-7xl">
            Meet the <br />
            <span className="bg-gradient-to-r from-[#bef264] to-[#f7fee7] bg-clip-text text-transparent">
              Architects.
            </span>
          </h2>
        </motion.div>

        {/* Team Grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="relative mx-auto mb-8 aspect-square overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 transition-all duration-500 group-hover:border-[#bef26433]">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full scale-110 object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-100 group-hover:opacity-100 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
                {member.name}
              </h3>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#bef264]">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
