import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BlogEditor from '@/components/superadmin/BlogEditor';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const metadata = { title: 'Edit Blog' };
export const dynamic = 'force-dynamic';

export default async function EditBlogPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
    redirect('/login');
  }

  await connectDB();
  const blog = await Blog.findById(params.id).lean();

  if (!blog) {
    redirect('/superadmin/blogs');
  }

  return <BlogEditor blog={JSON.parse(JSON.stringify(blog))} />;
}
