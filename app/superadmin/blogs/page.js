import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BlogsClient from '@/components/superadmin/BlogsClient';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const metadata = { title: 'Manage Blogs' };
export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superadmin') {
    redirect('/login');
  }

  await connectDB();
  const blogs = await Blog.find({})
    .populate('author', 'name avatar orgName')
    .sort({ createdAt: -1 })
    .lean();

  return <BlogsClient initialBlogs={JSON.parse(JSON.stringify(blogs))} />;
}
