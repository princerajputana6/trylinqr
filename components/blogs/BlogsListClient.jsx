'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Clock, Eye, ArrowRight, Search, ArrowUpRight, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'events', label: 'Events' },
  { value: 'tips', label: 'Tips & Tricks' },
  { value: 'guides', label: 'Guides' },
  { value: 'news', label: 'News' },
  { value: 'community', label: 'Community' },
  { value: 'featured', label: 'Featured' },
];

function SectionLabel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-3 inline-flex items-center gap-2"
    >
      <span className="h-px w-6 bg-brand-700" />
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-700">
        {children}
      </span>
    </motion.div>
  );
}

function FeaturedHero({ blog }) {
  if (!blog) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blogs/${blog.slug}`} className="group block">
        <div className="grid gap-0 overflow-hidden rounded-3xl border border-black/[0.07] bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-xl lg:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[460px]">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute left-5 top-5 rounded-full bg-brand-700 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              Featured
            </span>
          </div>

          <div className="flex flex-col justify-center p-8 lg:p-12">
            <span className="mb-4 inline-block rounded-full bg-brand-700/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-700">
              {blog.category}
            </span>

            <h2 className="font-display text-2xl font-black leading-tight text-black transition-colors group-hover:text-brand-700 sm:text-3xl lg:text-4xl">
              {blog.title}
            </h2>

            <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-black/60">
              {blog.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-[12px] text-black/50">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(blog.publishedAt || blog.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {blog.readTime} min read
              </span>
              {blog.views > 0 && (
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  {blog.views} views
                </span>
              )}
            </div>

            <div className="mt-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[13px] font-bold text-white transition-all group-hover:bg-brand-700">
                Read article <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ArticleCard({ blog, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blogs/${blog.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-all duration-300 hover:border-brand-700/20 hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden bg-black/5">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black/70 backdrop-blur-sm">
            {blog.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 font-display text-[17px] font-bold leading-snug text-black transition-colors group-hover:text-brand-700">
            {blog.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-black/55">
            {blog.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-black/[0.06] pt-4 text-[11px] text-black/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(blog.publishedAt || blog.createdAt, { month: 'short', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {blog.readTime}m
              </span>
            </div>
            <span className="flex items-center gap-1 font-semibold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
              Read <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogsListClient({ initialBlogs, featuredBlogs }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const headerRef = useRef(null);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 300], [0, -40]);

  const hero = featuredBlogs[0] || initialBlogs[0] || null;
  const otherFeatured = featuredBlogs.slice(1, 4);

  const filteredBlogs = initialBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || blog.category === category;
    return matchesSearch && matchesCategory;
  });

  const isFiltering = search.length > 0 || category !== 'all';

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* PAGE HEADER */}
      <section className="relative overflow-hidden bg-white pb-16 pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(148,66,104,0.06),transparent)]" />

        <div className="container-page relative">
          <motion.div ref={headerRef} style={{ y: headerY }} className="max-w-3xl">
            <SectionLabel>TryLinqr Journal</SectionLabel>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl font-black leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl"
            >
              Stories &amp; insights{' '}
              <span className="text-brand-700">from the team.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-5 max-w-xl text-[16px] leading-relaxed text-black/60"
            >
              Tips, guides, and stories about events, experiences, and the Indian community.
            </motion.p>
          </motion.div>

          {/* Search + filters */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <div className="relative min-w-[220px] max-w-xs flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-4 text-[13px] text-black placeholder-black/35 outline-none transition-all focus:border-brand-700/40 focus:ring-2 focus:ring-brand-700/10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${
                    category === cat.value
                      ? 'bg-black text-white'
                      : 'border border-black/10 bg-white text-black/60 hover:border-black/30 hover:text-black'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED HERO */}
      {!isFiltering && hero && (
        <section className="container-page py-12">
          <FeaturedHero blog={hero} />
        </section>
      )}

      {/* SECONDARY FEATURED */}
      {!isFiltering && otherFeatured.length > 0 && (
        <section className="container-page pb-10">
          <SectionLabel>Also featured</SectionLabel>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherFeatured.map((blog, i) => (
              <ArticleCard key={blog._id} blog={blog} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ALL ARTICLES */}
      <section className="container-page pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <SectionLabel>{isFiltering ? 'Search results' : 'Latest articles'}</SectionLabel>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display text-2xl font-black text-black"
            >
              {isFiltering
                ? `${filteredBlogs.length} article${filteredBlogs.length !== 1 ? 's' : ''} found`
                : 'All articles'}
            </motion.h2>
          </div>
        </div>

        {filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-black/[0.07] bg-white py-20 text-center"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-700/[0.08] text-brand-700">
              <BookOpen className="h-7 w-7" />
            </div>
            <p className="mt-4 font-semibold text-black">No articles found</p>
            <p className="mt-1 text-[13px] text-black/50">Try adjusting your search or category filter</p>
            <button
              onClick={() => { setSearch(''); setCategory('all'); }}
              className="mt-5 rounded-full border border-black/10 px-4 py-2 text-[12px] font-semibold text-black/60 transition-colors hover:border-black hover:text-black"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog, i) => (
              <ArticleCard key={blog._id} blog={blog} index={i % 9} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
