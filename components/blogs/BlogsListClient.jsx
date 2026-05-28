'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, ArrowRight, Search, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const CATEGORIES = [
  { value: 'all', label: 'All Posts' },
  { value: 'events', label: 'Events' },
  { value: 'tips', label: 'Tips & Tricks' },
  { value: 'guides', label: 'Guides' },
  { value: 'news', label: 'News' },
  { value: 'community', label: 'Community' },
  { value: 'featured', label: 'Featured' },
];

export default function BlogsListClient({ initialBlogs, featuredBlogs }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredBlogs = initialBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || blog.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700/10 via-brand-600/5 to-transparent py-20 pt-28">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
        
        <div className="container-page relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-700/10 text-brand-700"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>

            <h1 className="font-display text-4xl font-extrabold text-obsidian sm:text-5xl lg:text-6xl">
              Blog & Stories
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-obsidian/70">
              Discover tips, guides, and inspiring stories about events, experiences, and community
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-8 max-w-xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-obsidian/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="input w-full pl-12 pr-4"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {featuredBlogs.length > 0 && (
        <section className="container-page py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 font-display text-2xl font-bold text-obsidian">
              Featured Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredBlogs.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link href={`/blogs/${blog.slug}`} className="group block">
                    <div className="card overflow-hidden">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute right-3 top-3">
                          <span className="rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white">
                            Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="mb-2 flex items-center gap-2 text-xs text-obsidian/60">
                          <span className="font-medium text-brand-700">
                            {blog.category}
                          </span>
                          <span>•</span>
                          <span>{blog.readTime} min read</span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-obsidian group-hover:text-brand-700">
                          {blog.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-obsidian/65">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      <section className="container-page py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === cat.value
                  ? 'bg-brand-700 text-white'
                  : 'bg-white text-obsidian hover:bg-brand-700/10'
              } border border-ink-line`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {filteredBlogs.length === 0 ? (
          <div className="card grid place-items-center py-20 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-700/[0.08] text-brand-700">
              <Search className="h-7 w-7" />
            </div>
            <p className="mt-4 font-semibold text-obsidian">No articles found</p>
            <p className="mt-1 text-sm text-ink-muted">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <Link href={`/blogs/${blog.slug}`} className="group block h-full">
                  <div className="card flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex items-center gap-2 text-xs text-obsidian/60">
                        <span className="rounded-full bg-brand-700/10 px-2 py-0.5 font-medium text-brand-700">
                          {blog.category}
                        </span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{blog.readTime} min</span>
                      </div>

                      <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-obsidian group-hover:text-brand-700">
                        {blog.title}
                      </h3>

                      <p className="mb-4 line-clamp-2 text-sm text-obsidian/65">
                        {blog.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-ink-line pt-4 text-xs text-obsidian/60">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(blog.publishedAt || blog.createdAt, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {blog.views || 0}
                          </div>
                        </div>
                        <span className="flex items-center gap-1 font-medium text-brand-700">
                          Read <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
