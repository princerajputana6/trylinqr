import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug: params.slug, status: 'published' })
      .populate('author', 'name avatar orgName')
      .lean();

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}
