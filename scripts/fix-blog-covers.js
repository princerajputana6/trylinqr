/*
 * One-shot backfill for blog posts whose coverImage is the broken
 * `source.unsplash.com/featured/...` URL. Re-uploads a category-matched
 * Unsplash photo to Cloudinary and updates the doc.
 *
 * Usage: node scripts/fix-blog-covers.js
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');

const MONGODB_URI = process.env.MONGODB_URI;
const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_NAME ||
  '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINARY_SECRET_KEY ||
  '';

if (!MONGODB_URI || !CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Mongo or Cloudinary creds missing in .env.local');
  process.exit(1);
}

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET });

const POOLS = {
  events:    ['1470229722913-7c0e2dbbafd3', '1533174072545-7a4b6ad7a6c3', '1492684223066-81342ee5ff30', '1429962714451-bb934ecdc4ec', '1501281668745-f7f57925c3b4'],
  tips:      ['1499951360447-b19be8fe80f5', '1455390582262-044cdead277a', '1517245386807-bb43f82c33c4', '1432821596592-e2c18b78144f', '1542435503-956c469947f6'],
  guides:    ['1502920917128-1aa500764cbd', '1488646953014-85cb44e25828', '1473625247510-8ceb1760943f', '1530789253388-582c481c54b0', '1467269204594-9661b134dd2b'],
  news:      ['1504711434969-e33886168f5c', '1495020689067-958852a7765e', '1432821596592-e2c18b78144f', '1450101499163-c8848c66ca85', '1574391884720-bbc3740c59d1'],
  community: ['1511795409834-ef04bbd61622', '1543353071-873f17a7a088', '1531058020387-3be344556be6', '1518834107812-67b0b7c58434', '1556761175-5973dc0f32e7'],
  featured:  ['1506157786151-b8491531f063', '1558981806-ec527fa84c39', '1574391884720-bbc3740c59d1', '1571008887538-b36bb32f4571', '1533174072545-7a4b6ad7a6c3'],
};

function pickPhotoId(category) {
  const pool = POOLS[category] || POOLS.news;
  return pool[Math.floor(Math.random() * pool.length)];
}

const blogSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

function isBroken(url) {
  if (!url) return true;
  if (url.includes('source.unsplash.com')) return true;
  return false;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

  const blogs = await Blog.find({}).lean();
  console.log(`Scanning ${blogs.length} blogs`);

  let fixed = 0;
  for (const blog of blogs) {
    if (!isBroken(blog.coverImage)) continue;
    const id = pickPhotoId(blog.category || 'news');
    const remoteUrl = `https://images.unsplash.com/photo-${id}?w=1600&q=85&fm=jpg`;
    try {
      const res = await cloudinary.uploader.upload(remoteUrl, {
        folder: 'trylinqr/blog-covers',
        public_id: `auto_${blog.slug}`,
        overwrite: true,
        resource_type: 'image',
      });
      await Blog.updateOne({ _id: blog._id }, { $set: { coverImage: res.secure_url } });
      console.log(`✓ ${blog.title}`);
      fixed += 1;
    } catch (err) {
      console.error(`✗ ${blog.title}: ${err.message}`);
    }
  }

  console.log(`\nFixed ${fixed} cover image(s)`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
