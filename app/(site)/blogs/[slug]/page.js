import { notFound } from 'next/navigation';
import BlogDetailClient from '@/components/blogs/BlogDetailClient';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function generateMetadata({ params }) {
  await connectDB();
  const blog = await Blog.findOne({ slug: params.slug, status: 'published' }).lean();

  if (!blog) {
    return { title: 'Blog Not Found' };
  }

  return {
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.excerpt,
    keywords: blog.seo?.keywords || blog.tags,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage],
      type: 'article',
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }) {
  await connectDB();
  
  const blog = await Blog.findOne({ slug: params.slug, status: 'published' })
    .populate('author', 'name avatar orgName')
    .lean();

  if (!blog) {
    notFound();
  }

  await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

  const relatedBlogs = await Blog.find({
    status: 'published',
    category: blog.category,
    _id: { $ne: blog._id },
  })
    .populate('author', 'name avatar orgName')
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  return (
    <BlogDetailClient
      blog={JSON.parse(JSON.stringify(blog))}
      relatedBlogs={JSON.parse(JSON.stringify(relatedBlogs))}
    />
  );
}
