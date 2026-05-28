import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, category = 'news' } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert content writer for TryLinqr, an event booking platform. Write engaging, SEO-optimized blog posts about events, entertainment, and community experiences. Use a friendly, professional tone. Format the content in Markdown with proper headings, lists, and emphasis.`,
        },
        {
          role: 'user',
          content: `Write a comprehensive blog post about: "${title}". 
          
Category: ${category}

The blog should include:
1. An engaging introduction (2-3 paragraphs)
2. Main content with 4-5 sections with H2 headings
3. Practical tips or insights
4. A compelling conclusion with a call-to-action
5. Make it around 1200-1500 words
6. Use Markdown formatting (##, ###, **, *, lists, etc.)
7. Include relevant examples related to events and experiences
8. Make it SEO-friendly with natural keyword usage

Format the response as JSON with these fields:
{
  "title": "optimized title",
  "excerpt": "compelling 150-character summary",
  "content": "full markdown content",
  "metaDescription": "SEO meta description (150-160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "tags": ["tag1", "tag2", "tag3"],
  "readTime": estimated_read_time_in_minutes,
  "suggestedImages": ["description of image 1", "description of image 2", "description of image 3"]
}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const generatedContent = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return NextResponse.json({
      success: true,
      data: generatedContent,
    });
  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog content', details: error.message },
      { status: 500 }
    );
  }
}
