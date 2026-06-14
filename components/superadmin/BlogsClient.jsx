'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  Search,
  Filter,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
};

export default function BlogsClient({ initialBlogs }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoBusy, setAutoBusy] = useState(false);
  const [autoStep, setAutoStep] = useState('');

  const handleAutoPublish = async () => {
    if (autoBusy) return;
    if (
      !confirm(
        'This will research 5 trending topics, write full blog posts with Groq, and publish them immediately. Takes about 1-2 minutes. Continue?',
      )
    ) {
      return;
    }

    setAutoBusy(true);
    setAutoStep('Researching trending topics…');
    // Cycle through encouraging status messages while the request runs — the
    // server doesn't stream progress, so this is purely for the UI feel.
    const STEPS = [
      'Researching trending topics…',
      'Drafting blog 1 of 5…',
      'Drafting blog 2 of 5…',
      'Drafting blog 3 of 5…',
      'Drafting blog 4 of 5…',
      'Drafting blog 5 of 5…',
      'Publishing…',
    ];
    let stepIdx = 0;
    const stepTimer = setInterval(() => {
      stepIdx = Math.min(stepIdx + 1, STEPS.length - 1);
      setAutoStep(STEPS[stepIdx]);
    }, 12000);

    try {
      const res = await fetch('/api/blogs/auto-publish', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auto-publish failed');

      const created = Array.isArray(data.created) ? data.created : [];
      const failures = Array.isArray(data.failures) ? data.failures : [];
      if (created.length > 0) {
        toast.success(
          `Published ${created.length} blog${created.length === 1 ? '' : 's'}` +
            (failures.length ? ` (${failures.length} failed)` : ''),
        );
      } else {
        toast.error('No blogs were published');
      }
      router.refresh();
    } catch (err) {
      toast.error(err.message || 'Auto-publish failed');
    } finally {
      clearInterval(stepTimer);
      setAutoBusy(false);
      setAutoStep('');
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      setBlogs(blogs.filter((b) => b._id !== id));
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <div className="min-h-screen bg-pearl py-8">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-obsidian">
                Manage Blogs
              </h1>
              <p className="mt-1 text-sm text-obsidian/60">
                Create and manage blog posts for your platform
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleAutoPublish}
                disabled={autoBusy}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-700/30 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-700/[0.06] disabled:cursor-not-allowed disabled:opacity-70"
                title="Research 5 topics with Groq and publish full blog posts"
              >
                {autoBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {autoBusy ? autoStep || 'Working…' : 'Auto-publish 5 blogs'}
              </button>
              <button
                onClick={() => router.push('/superadmin/blogs/create')}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Blog
              </button>
            </div>
          </div>

          <div className="card mb-6 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search blogs..."
                  className="input pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full sm:w-40"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="card grid place-items-center py-20 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-700/[0.08] text-brand-700">
                <Search className="h-7 w-7" />
              </div>
              <p className="mt-4 font-semibold text-obsidian">No blogs found</p>
              <p className="mt-1 text-sm text-ink-muted">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first blog post to get started'}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="card group overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute right-3 top-3 flex gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_COLORS[blog.status]
                        }`}
                      >
                        {blog.status}
                      </span>
                      {blog.isFeatured && (
                        <span className="rounded-full bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2 text-xs text-obsidian/60">
                      <span className="rounded-full bg-brand-700/10 px-2 py-0.5 font-medium text-brand-700">
                        {blog.category}
                      </span>
                      <span>•</span>
                      <span>{blog.readTime} min read</span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold text-obsidian">
                      {blog.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 text-sm text-obsidian/65">
                      {blog.excerpt}
                    </p>

                    <div className="mb-4 flex items-center gap-4 text-xs text-obsidian/60">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {blog.views || 0}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(blog.createdAt, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/superadmin/blogs/${blog._id}/edit`)
                        }
                        className="btn-outline flex-1 text-sm"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
