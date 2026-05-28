import BlogsListClient from '@/components/blogs/BlogsListClient';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const metadata = {
  title: 'Blog',
  description: 'Discover tips, guides, and stories about events and experiences',
};

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  await connectDB();
  
  const blogs = await Blog.find({ status: 'published' })
    .populate('author', 'name avatar orgName')
    .sort({ publishedAt: -1 })
    .limit(20)
    .lean();

  const featured = await Blog.find({ status: 'published', isFeatured: true })
    .populate('author', 'name avatar orgName')
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  return (
    <BlogsListClient
      initialBlogs={JSON.parse(JSON.stringify(blogs))}
      featuredBlogs={JSON.parse(JSON.stringify(featured))}
    />
  );
}
