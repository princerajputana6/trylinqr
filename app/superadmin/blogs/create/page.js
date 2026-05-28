import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import BlogEditor from '@/components/superadmin/BlogEditor';

export const metadata = { title: 'Create Blog' };

export default async function CreateBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
    redirect('/login');
  }

  return <BlogEditor />;
}
