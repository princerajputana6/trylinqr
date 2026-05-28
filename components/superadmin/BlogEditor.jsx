'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Save,
  Eye,
  ArrowLeft,
  Upload,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'events', label: 'Events' },
  { value: 'tips', label: 'Tips & Tricks' },
  { value: 'guides', label: 'Guides' },
  { value: 'news', label: 'News' },
  { value: 'community', label: 'Community' },
  { value: 'featured', label: 'Featured' },
];

export default function BlogEditor({ blog }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    coverImage: blog?.coverImage || '',
    category: blog?.category || 'news',
    tags: blog?.tags?.join(', ') || '',
    status: blog?.status || 'draft',
    isFeatured: blog?.isFeatured || false,
    readTime: blog?.readTime || 5,
    seo: {
      metaTitle: blog?.seo?.metaTitle || '',
      metaDescription: blog?.seo?.metaDescription || '',
      keywords: blog?.seo?.keywords?.join(', ') || '',
    },
  });

  const handleGenerateContent = async () => {
    if (!formData.title) {
      toast.error('Please enter a title first');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/blogs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFormData((prev) => ({
        ...prev,
        title: data.data.title || prev.title,
        excerpt: data.data.excerpt || prev.excerpt,
        content: data.data.content || prev.content,
        readTime: data.data.readTime || prev.readTime,
        tags: data.data.tags?.join(', ') || prev.tags,
        seo: {
          metaTitle: data.data.title || prev.seo.metaTitle,
          metaDescription: data.data.metaDescription || prev.seo.metaDescription,
          keywords: data.data.keywords?.join(', ') || prev.seo.keywords,
        },
      }));

      toast.success('Blog content generated successfully! You can now edit it.');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'trylinqr');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();
      setFormData((prev) => ({ ...prev, coverImage: data.secure_url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        seo: {
          metaTitle: formData.seo.metaTitle,
          metaDescription: formData.seo.metaDescription,
          keywords: formData.seo.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        },
      };

      const url = blog ? `/api/blogs/${blog._id}` : '/api/blogs';
      const method = blog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(blog ? 'Blog updated successfully' : 'Blog created successfully');
      router.push('/superadmin/blogs');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl py-8">
      <div className="container-page max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="grid h-10 w-10 place-items-center rounded-lg border border-ink-line bg-white text-obsidian hover:bg-pearl"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-2xl font-bold text-obsidian">
                  {blog ? 'Edit Blog' : 'Create New Blog'}
                </h1>
                <p className="text-sm text-obsidian/60">
                  {blog ? 'Update your blog post' : 'Write and publish a new blog post'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-obsidian">
                  Blog Content
                </h2>
                <button
                  type="button"
                  onClick={handleGenerateContent}
                  disabled={generating || !formData.title}
                  className="btn-primary flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input"
                    placeholder="Enter blog title..."
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="input"
                      required
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="input"
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Cover Image *</label>
                  <div className="space-y-3">
                    {formData.coverImage && (
                      <div className="relative aspect-video overflow-hidden rounded-lg border border-ink-line">
                        <img
                          src={formData.coverImage}
                          alt="Cover"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={formData.coverImage}
                        onChange={(e) =>
                          setFormData({ ...formData, coverImage: e.target.value })
                        }
                        className="input flex-1"
                        placeholder="Image URL or upload..."
                        required
                      />
                      <label className="btn-outline flex cursor-pointer items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Excerpt *</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    className="input min-h-[80px]"
                    placeholder="Brief summary of the blog post..."
                    required
                  />
                  <p className="mt-1 text-xs text-obsidian/60">
                    {formData.excerpt.length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="label">Content * (Markdown supported)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="input min-h-[400px] font-mono text-sm"
                    placeholder="Write your blog content here... Markdown is supported."
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="input"
                      placeholder="events, tips, guide"
                    />
                  </div>

                  <div>
                    <label className="label">Read Time (minutes)</label>
                    <input
                      type="number"
                      value={formData.readTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          readTime: parseInt(e.target.value) || 5,
                        })
                      }
                      className="input"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-ink-line text-brand-700 focus:ring-brand-700"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-obsidian">
                    Mark as Featured
                  </label>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="mb-4 font-display text-lg font-bold text-obsidian">
                SEO Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Meta Title</label>
                  <input
                    type="text"
                    value={formData.seo.metaTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaTitle: e.target.value },
                      })
                    }
                    className="input"
                    placeholder="SEO title for search engines"
                  />
                </div>

                <div>
                  <label className="label">Meta Description</label>
                  <textarea
                    value={formData.seo.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, metaDescription: e.target.value },
                      })
                    }
                    className="input min-h-[80px]"
                    placeholder="SEO description (150-160 characters)"
                  />
                </div>

                <div>
                  <label className="label">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.seo.keywords}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, keywords: e.target.value },
                      })
                    }
                    className="input"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {blog ? 'Update Blog' : 'Create Blog'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
