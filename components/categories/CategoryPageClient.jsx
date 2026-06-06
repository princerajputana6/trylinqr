'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import EventGrid from '@/components/events/EventGrid';
import { categoryBySlug } from '@/lib/constants';

const categoryThemes = {
  'bike-ride': {
    gradient: 'from-orange-500/20 via-orange-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.15)_0%,transparent_50%)]',
    description: 'Join thrilling bike rides and explore scenic routes with fellow riders',
    features: ['Scenic Routes', 'Group Rides', 'Safety First', 'All Skill Levels'],
    emoji: '🏍️',
    animation: {
      iconRotate: 360,
      iconDuration: 0.8,
      titleDelay: 0.4,
      particleEffect: 'speed',
    },
  },
  jagran: {
    gradient: 'from-yellow-500/20 via-yellow-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_70%_30%,rgba(234,179,8,0.15)_0%,transparent_50%)]',
    description: 'Experience divine spiritual gatherings and devotional celebrations',
    features: ['Spiritual Vibes', 'Live Bhajans', 'Community', 'Devotional'],
    emoji: '🔥',
    animation: {
      iconRotate: 0,
      iconDuration: 1.2,
      titleDelay: 0.5,
      particleEffect: 'glow',
    },
  },
  function: {
    gradient: 'from-pink-500/20 via-pink-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.15)_0%,transparent_50%)]',
    description: 'Celebrate life\'s special moments with grand functions and parties',
    features: ['Celebrations', 'Grand Venues', 'Entertainment', 'Memorable'],
    emoji: '🎉',
    animation: {
      iconRotate: -180,
      iconDuration: 0.9,
      titleDelay: 0.3,
      particleEffect: 'confetti',
    },
  },
  concert: {
    gradient: 'from-purple-500/20 via-purple-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.15)_0%,transparent_50%)]',
    description: 'Live music performances from top artists and emerging talents',
    features: ['Live Music', 'Top Artists', 'Amazing Sound', 'Unforgettable'],
    emoji: '🎤',
    animation: {
      iconRotate: 180,
      iconDuration: 1.0,
      titleDelay: 0.4,
      particleEffect: 'wave',
    },
  },
  workshop: {
    gradient: 'from-cyan-500/20 via-cyan-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_60%_40%,rgba(6,182,212,0.15)_0%,transparent_50%)]',
    description: 'Learn new skills and enhance your knowledge with expert-led workshops',
    features: ['Skill Building', 'Expert Trainers', 'Hands-on', 'Certificates'],
    emoji: '🔧',
    animation: {
      iconRotate: 90,
      iconDuration: 0.7,
      titleDelay: 0.3,
      particleEffect: 'build',
    },
  },
  sports: {
    gradient: 'from-green-500/20 via-green-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_30%_70%,rgba(34,197,94,0.15)_0%,transparent_50%)]',
    description: 'Compete, watch, and enjoy various sporting events and tournaments',
    features: ['Tournaments', 'Team Spirit', 'Fitness', 'Competition'],
    emoji: '🏆',
    animation: {
      iconRotate: 720,
      iconDuration: 1.2,
      titleDelay: 0.5,
      particleEffect: 'bounce',
    },
  },
  festival: {
    gradient: 'from-red-900/20 via-red-800/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_50%_30%,rgba(113,0,20,0.15)_0%,transparent_50%)]',
    description: 'Immerse yourself in cultural festivals and traditional celebrations',
    features: ['Cultural', 'Traditional', 'Food & Fun', 'Community'],
    emoji: '⛺',
    animation: {
      iconRotate: -360,
      iconDuration: 1.0,
      titleDelay: 0.4,
      particleEffect: 'celebrate',
    },
  },
  exhibition: {
    gradient: 'from-blue-500/20 via-blue-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.15)_0%,transparent_50%)]',
    description: 'Explore art, innovation, and creativity at curated exhibitions',
    features: ['Art & Design', 'Innovation', 'Networking', 'Inspiration'],
    emoji: '🖼️',
    animation: {
      iconRotate: 0,
      iconDuration: 0.8,
      titleDelay: 0.3,
      particleEffect: 'frame',
    },
  },
  food: {
    gradient: 'from-amber-600/20 via-amber-500/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_40%_40%,rgba(179,143,111,0.15)_0%,transparent_50%)]',
    description: 'Savor culinary delights and food experiences from around the world',
    features: ['Gourmet', 'Food Trucks', 'Tastings', 'Culinary'],
    emoji: '🍽️',
    animation: {
      iconRotate: 180,
      iconDuration: 0.9,
      titleDelay: 0.4,
      particleEffect: 'steam',
    },
  },
  comedy: {
    gradient: 'from-purple-600/20 via-purple-500/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_60%_60%,rgba(168,85,247,0.15)_0%,transparent_50%)]',
    description: 'Laugh out loud with stand-up comedy shows and humorous performances',
    features: ['Stand-up', 'Laughter', 'Top Comedians', 'Fun Night'],
    emoji: '😂',
    animation: {
      iconRotate: -90,
      iconDuration: 0.6,
      titleDelay: 0.2,
      particleEffect: 'laugh',
    },
  },
  corporate: {
    gradient: 'from-slate-500/20 via-slate-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(100,116,139,0.15)_0%,transparent_50%)]',
    description: 'Professional networking events, conferences, and corporate gatherings',
    features: ['Networking', 'Professional', 'Industry Leaders', 'Growth'],
    emoji: '💼',
    animation: {
      iconRotate: 0,
      iconDuration: 0.7,
      titleDelay: 0.3,
      particleEffect: 'professional',
    },
  },
  travel: {
    gradient: 'from-sky-500/20 via-sky-400/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(166,197,220,0.18)_0%,transparent_50%)]',
    description: 'Curated group tours, treks, retreats and weekend getaways with verified travel hosts',
    features: ['Curated Itineraries', 'Small Groups', 'Verified Hosts', 'Pan-India & Abroad'],
    emoji: '✈️',
    animation: {
      iconRotate: 30,
      iconDuration: 1.0,
      titleDelay: 0.4,
      particleEffect: 'sparkle',
    },
  },
  other: {
    gradient: 'from-slate-400/20 via-slate-300/10 to-transparent',
    pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.15)_0%,transparent_50%)]',
    description: 'Discover unique and diverse events across various categories',
    features: ['Diverse', 'Unique', 'Exciting', 'Discover'],
    emoji: '✨',
    animation: {
      iconRotate: 360,
      iconDuration: 1.0,
      titleDelay: 0.4,
      particleEffect: 'sparkle',
    },
  },
};

export default function CategoryPageClient({ categorySlug, events }) {
  const category = categoryBySlug(categorySlug);
  const Icon = category.icon;
  const theme = categoryThemes[categorySlug] || categoryThemes.other;

  return (
    <div className="min-h-screen">
      <section
        className="relative overflow-hidden"
        style={{ height: '40vh', minHeight: '400px' }}
      >
        {/* Video Background */}
        <div className="absolute inset-0">
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
            style={{ 
              background: `linear-gradient(135deg, ${category.color}15, ${category.color}05)`,
            }}
          />
          <div className={`absolute inset-0 ${theme.pattern}`} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
          
          {/* Animated gradient overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${category.color}20 0%, transparent 70%)`,
            }}
          />
          
          {/* Floating particles effect */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 - 50,
                y: 100,
                opacity: 0,
                scale: 0,
              }}
              animate={{ 
                x: Math.random() * 200 - 100,
                y: -100,
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
              className="absolute rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                width: `${8 + Math.random() * 16}px`,
                height: `${8 + Math.random() * 16}px`,
                background: category.color,
                filter: 'blur(4px)',
              }}
            />
          ))}
        </div>
        
        <div className="container-page relative flex h-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: theme.animation.iconDuration,
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              className="mx-auto mb-4 inline-flex"
            >
              <motion.div
                whileHover={{ 
                  rotate: theme.animation.iconRotate,
                  scale: 1.15,
                }}
                transition={{ 
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className="grid h-16 w-16 place-items-center rounded-2xl shadow-2xl backdrop-blur-sm sm:h-20 sm:w-20"
                style={{
                  background: `linear-gradient(135deg, ${category.color}40, ${category.color}20)`,
                  color: category.color,
                  border: `2px solid ${category.color}30`,
                }}
              >
                <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.2} />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: theme.animation.titleDelay, duration: 0.6 }}
              className="font-display text-4xl font-extrabold text-obsidian sm:text-5xl lg:text-6xl"
            >
              {category.label}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: theme.animation.titleDelay + 0.3, duration: 0.4 }}
                whileHover={{ scale: 1.2, rotate: 15 }}
                className="ml-2 inline-block"
              >
                {theme.emoji}
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-obsidian/70 sm:text-lg"
            >
              {theme.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 inline-flex items-center gap-6 rounded-2xl border border-ink-line bg-white/90 px-6 py-3 shadow-card backdrop-blur-sm sm:gap-8 sm:px-8 sm:py-4"
            >
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="font-display text-2xl font-extrabold sm:text-3xl"
                  style={{ color: category.color }}
                >
                  {events.length}
                </motion.div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-obsidian/60 sm:text-xs">
                  Events
                </div>
              </div>
              <div className="h-8 w-px bg-ink-line sm:h-10" />
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="font-display text-2xl font-extrabold sm:text-3xl"
                  style={{ color: category.color }}
                >
                  <TrendingUp className="inline h-6 w-6 sm:h-7 sm:w-7" />
                </motion.div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-obsidian/60 sm:text-xs">
                  Trending
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-pearl to-transparent"
        />
      </section>

      <section className="container-page py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-obsidian">
                Upcoming Events
              </h2>
              <p className="mt-2 text-sm text-obsidian/65">
                {events.length > 0
                  ? `Discover ${events.length} amazing ${category.label.toLowerCase()} event${events.length !== 1 ? 's' : ''}`
                  : `No ${category.label.toLowerCase()} events available right now`}
              </p>
            </div>
            {events.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hidden items-center gap-2 text-sm text-obsidian/60 sm:flex"
              >
                <Calendar className="h-4 w-4" />
                <span>Sorted by date</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <EventGrid events={events} empty={`No ${category.label} events yet. Check back soon!`} />
        </motion.div>
      </section>

    </div>
  );
}
