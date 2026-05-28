'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, ArrowLeft, Share2, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function BlogDetailClient({ blog, relatedBlogs }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-pearl">
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/20" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container-page w-full pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-4xl"
            >
              <Link
                href="/blogs"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </Link>

              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="rounded-full bg-brand-700 px-3 py-1 font-semibold text-white">
                  {blog.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.publishedAt || blog.createdAt, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {blog.readTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {blog.views || 0} views
                </div>
              </div>

              <h1 className="mb-4 font-display text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                {blog.title}
              </h1>

              <p className="text-lg text-white/90">{blog.excerpt}</p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {blog.author?.avatar && (
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      className="h-12 w-12 rounded-full border-2 border-white/20"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">
                      {blog.author?.name || 'TryLinqr Team'}
                    </p>
                    {blog.author?.orgName && (
                      <p className="text-sm text-white/70">{blog.author.orgName}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container-page py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="card p-8 sm:p-12">
            <div className="prose prose-lg prose-brand max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="mb-4 mt-8 font-display text-2xl font-bold text-obsidian" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="mb-3 mt-6 font-display text-xl font-bold text-obsidian" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-4 leading-relaxed text-obsidian/80" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="mb-4 ml-6 list-disc space-y-2 text-obsidian/80" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="mb-4 ml-6 list-decimal space-y-2 text-obsidian/80" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="font-medium text-brand-700 hover:underline" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="my-6 border-l-4 border-brand-700 bg-brand-700/5 py-4 pl-6 pr-4 italic text-obsidian/80" {...props} />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code className="rounded bg-obsidian/5 px-1.5 py-0.5 font-mono text-sm text-brand-700" {...props} />
                    ) : (
                      <code className="block rounded-lg bg-obsidian/5 p-4 font-mono text-sm" {...props} />
                    ),
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 border-t border-ink-line pt-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-obsidian/60" />
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-700/10 px-3 py-1 text-sm font-medium text-brand-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.article>

        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-12 max-w-4xl"
          >
            <h2 className="mb-6 font-display text-2xl font-bold text-obsidian">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {relatedBlogs.map((relatedBlog, i) => (
                <motion.div
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link href={`/blogs/${relatedBlog.slug}`} className="group block">
                    <div className="card overflow-hidden">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={relatedBlog.coverImage}
                          alt={relatedBlog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="mb-2 line-clamp-2 font-display text-base font-bold text-obsidian group-hover:text-brand-700">
                          {relatedBlog.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-obsidian/65">
                          {relatedBlog.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
