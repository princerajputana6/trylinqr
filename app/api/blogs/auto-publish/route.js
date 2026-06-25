/*
 * One-click "publish 5 fresh blogs" endpoint.
 *
 * Flow:
 *   1. Ask Groq for 5 trending topic ideas for an Indian event-booking
 *      platform, each with a 1-3 word Unsplash image keyword.
 *   2. For each topic, ask Groq to write a full markdown blog post with
 *      the same JSON shape /api/blogs/generate already returns.
 *   3. Persist each as a published Blog attributed to the calling
 *      superadmin, with the Unsplash source URL as coverImage.
 *
 * The whole call takes ~60-120s — the UI shows progress via toasts.
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Groq from 'groq-sdk';
import cloudinary, { cloudinaryConfigured } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/* Curated, royalty-free Unsplash photo IDs per blog category. These URLs
   resolve directly (no redirects) so Cloudinary's uploader can fetch and
   cache them reliably. Picked one at random per published post. */
const UNSPLASH_POOLS = {
  events: [
    '1470229722913-7c0e2dbbafd3', // crowd at concert lights
    '1533174072545-7a4b6ad7a6c3', // festival lights
    '1492684223066-81342ee5ff30', // event hall
    '1429962714451-bb934ecdc4ec', // concert stage
    '1501281668745-f7f57925c3b4', // crowd cheering
  ],
  tips: [
    '1499951360447-b19be8fe80f5', // notebook + pen
    '1455390582262-044cdead277a', // checklist
    '1517245386807-bb43f82c33c4', // workspace tips
    '1432821596592-e2c18b78144f', // travel tips
    '1542435503-956c469947f6',    // post-it notes
  ],
  guides: [
    '1502920917128-1aa500764cbd', // map + camera
    '1488646953014-85cb44e25828', // travel guide
    '1473625247510-8ceb1760943f', // compass map
    '1530789253388-582c481c54b0', // walking tour
    '1467269204594-9661b134dd2b', // city guide
  ],
  news: [
    '1504711434969-e33886168f5c', // newsroom desk
    '1495020689067-958852a7765e', // newspaper
    '1432821596592-e2c18b78144f', // typing on laptop
    '1450101499163-c8848c66ca85', // press conference
    '1574391884720-bbc3740c59d1', // event news cover
  ],
  community: [
    '1511795409834-ef04bbd61622', // friends celebrating
    '1543353071-873f17a7a088',    // food shared at table
    '1531058020387-3be344556be6', // people at gathering
    '1518834107812-67b0b7c58434', // dance / community
    '1556761175-5973dc0f32e7',    // community workshop
  ],
  featured: [
    '1506157786151-b8491531f063', // rock concert lights
    '1558981806-ec527fa84c39',    // motorcycle adventure
    '1574391884720-bbc3740c59d1', // jagran lights
    '1571008887538-b36bb32f4571', // marathon crowd
    '1533174072545-7a4b6ad7a6c3', // festival
  ],
};

function pickPhotoId(category) {
  const pool = UNSPLASH_POOLS[category] || UNSPLASH_POOLS.news;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function uploadCover(category, slug) {
  const id = pickPhotoId(category);
  const remoteUrl = `https://images.unsplash.com/photo-${id}?w=1600&q=85&fm=jpg`;
  if (!cloudinaryConfigured()) {
    // Cloudinary not set up — fall back to the direct Unsplash URL.
    return remoteUrl;
  }
  try {
    const res = await cloudinary.uploader.upload(remoteUrl, {
      folder: 'trylinqr/blog-covers',
      public_id: `auto_${slug}`,
      overwrite: true,
      resource_type: 'image',
    });
    return res.secure_url;
  } catch (err) {
    // Cloudinary failures shouldn't kill the whole publish — fall back
    // to the direct Unsplash URL, which is still a valid image.
    console.error('blog auto-publish: cover upload failed, using direct URL', err);
    return remoteUrl;
  }
}

const SYSTEM_PROMPT =
  'You are an expert content writer for TryLinqr, an Indian event-booking platform. Write engaging, SEO-optimized blog posts about events, bike rides, concerts, jagrans, workshops and community experiences in India. Use a friendly, professional tone. Format the content in Markdown with proper headings, lists, and emphasis.';

const ALLOWED_CATEGORIES = ['events', 'tips', 'guides', 'news', 'community', 'featured'];

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function uniqueSlug(base) {
  let slug = base;
  let i = 0;
  // collision guard — append -2, -3… if a blog with this slug already lives
  // in the DB. Bounded so a degenerate case can't loop forever.
  while (i < 25 && (await Blog.exists({ slug }))) {
    i += 1;
    slug = `${base}-${i + 1}`;
  }
  return slug;
}

async function discoverTopics(groq) {
  const res = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Suggest 5 fresh, trending blog topic ideas for TryLinqr. Mix categories — events, tips, guides, news, community. Avoid generic topics; make each one specific and timely for India today.

Respond as JSON:
{
  "topics": [
    {
      "title": "the blog title (60 chars max, attention-grabbing)",
      "category": "one of: events, tips, guides, news, community, featured",
      "imageKeyword": "1-3 word Unsplash search keyword that fits the topic"
    }
  ]
}`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.9,
    max_tokens: 1024,
    response_format: { type: 'json_object' },
  });
  const parsed = JSON.parse(res.choices[0]?.message?.content || '{}');
  const topics = Array.isArray(parsed.topics) ? parsed.topics.slice(0, 5) : [];
  return topics.filter((t) => t && t.title);
}

async function writeBlog(groq, topic) {
  const res = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Write a comprehensive blog post about: "${topic.title}".

Category: ${topic.category || 'news'}

The blog should include:
1. An engaging introduction (2-3 paragraphs)
2. Main content with 4-5 sections with H2 headings
3. Practical tips or insights
4. A compelling conclusion with a call-to-action
5. Make it around 1200-1500 words
6. Use Markdown formatting (##, ###, **, *, lists, etc.)
7. Include relevant examples related to events and experiences in India
8. Make it SEO-friendly with natural keyword usage

Respond as JSON:
{
  "title": "optimized title",
  "excerpt": "compelling 150-character summary",
  "content": "full markdown content",
  "metaDescription": "SEO meta description (150-160 chars)",
  "keywords": ["keyword1","keyword2","keyword3","keyword4","keyword5"],
  "tags": ["tag1","tag2","tag3"],
  "readTime": 8
}`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(res.choices[0]?.message?.content || '{}');
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'superadmin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY not configured' },
        { status: 500 },
      );
    }

    await connectDB();
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const topics = await discoverTopics(groq);
    if (topics.length === 0) {
      return NextResponse.json(
        { error: 'Groq did not return any topic ideas' },
        { status: 502 },
      );
    }

    const created = [];
    const failures = [];

    for (const topic of topics) {
      try {
        const gen = await writeBlog(groq, topic);
        const title = gen.title || topic.title;
        const slug = await uniqueSlug(slugify(title));
        const category = ALLOWED_CATEGORIES.includes(topic.category)
          ? topic.category
          : 'news';

        const coverImage = await uploadCover(category, slug);
        const blog = await Blog.create({
          title,
          slug,
          excerpt: gen.excerpt || '',
          content: gen.content || '',
          coverImage,
          author: session.user.id,
          category,
          tags: Array.isArray(gen.tags) ? gen.tags : [],
          status: 'draft',
          readTime: Number.isFinite(gen.readTime) ? gen.readTime : 8,
          seo: {
            metaTitle: title,
            metaDescription: gen.metaDescription || gen.excerpt || '',
            keywords: Array.isArray(gen.keywords) ? gen.keywords : [],
          },
        });
        created.push({ _id: blog._id, title, slug });
      } catch (err) {
        console.error('auto-publish: failed to write blog for', topic, err);
        failures.push({ title: topic.title, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      created,
      failures,
      requested: topics.length,
    });
  } catch (error) {
    console.error('Auto-publish error:', error);
    return NextResponse.json(
      { error: error.message || 'Auto-publish failed' },
      { status: 500 },
    );
  }
}
