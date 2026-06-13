/*
 * Seeds the 5 "TryLinqr Originals" hero events the user designed posters
 * for. Stock Unsplash banners get re-uploaded to Cloudinary so we own the
 * asset. Idempotent — re-running updates existing rows by slug.
 *
 * Usage: node scripts/seed-creative-events.js
 */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v2: cloudinary } = require('cloudinary');

const MONGODB_URI = process.env.MONGODB_URI;
const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  '';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINARY_SECRET_KEY ||
  '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env.local');
  process.exit(1);
}
if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('Cloudinary creds missing in .env.local');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: String,
    isVerified: Boolean,
    isApproved: Boolean,
    isBanned: Boolean,
    orgName: String,
    orgDescription: String,
    avatar: String,
  },
  { timestamps: true, strict: false },
);
const eventSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

function slugFor(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function daysFromNow(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  dt.setHours(18, 0, 0, 0);
  return dt;
}

const ORGANIZER = {
  email: 'originals@trylinqr.com',
  name: 'TryLinqr Originals',
  orgName: 'TryLinqr Originals',
  orgDescription:
    'Curated flagship experiences hand-picked by the TryLinqr team — rides, jagrans, workshops, festivals and food.',
  password: 'originals1234',
};

/* Stock Unsplash sources matched to each poster's vibe. The seed script
   re-uploads them to Cloudinary so the production banner URLs are stable. */
const EVENTS = [
  {
    title: 'Ride Beyond Limits',
    category: 'bike-ride',
    tagline: 'DISCOVER INDIA\'S MOST EPIC MOTORCYCLE ADVENTURES',
    description:
      'A weekend of scenic routes, hidden destinations and riding communities. Built for riders chasing the road less travelled — every escape ends where the next one begins.',
    venue: { city: 'Manali', state: 'Himachal Pradesh', country: 'India', name: 'Old Manali Base Camp' },
    daysAhead: 14,
    tiers: [
      { name: 'Solo Rider',  price: 5499, totalQuantity: 60 },
      { name: 'Pillion Pair', price: 9999, totalQuantity: 30 },
    ],
    tags: ['adventure', 'motorcycle', 'weekend', 'himalayas'],
    stockUrl:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&q=85',
  },
  {
    title: 'Divine Nights 2026',
    category: 'jagran',
    tagline: 'EXPERIENCE THE POWER OF DEVOTION & COMMUNITY',
    description:
      'A night of spiritual gatherings, bhajan and kirtan, divine blessings and cultural heritage. Faith. Music. Togetherness.',
    venue: { city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', name: 'Assi Ghat Open Stage' },
    daysAhead: 28,
    tiers: [
      { name: 'Open Darshan',  price: 0,    totalQuantity: 2000 },
      { name: 'Front Row Pass', price: 999, totalQuantity: 200  },
    ],
    tags: ['jagran', 'devotional', 'kirtan', 'culture'],
    stockUrl:
      'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=1600&q=85',
  },
  {
    title: 'Learn Build Grow',
    category: 'workshop',
    tagline: 'HANDS-ON WORKSHOPS THAT TRANSFORM SKILLS INTO OPPORTUNITIES',
    description:
      'Industry experts, practical learning, networking and career growth — invest in skills that matter. A full-day workshop track for builders and operators.',
    venue: { city: 'Bengaluru', state: 'Karnataka', country: 'India', name: 'Indiranagar Innovation Hub' },
    daysAhead: 21,
    tiers: [
      { name: 'Student',        price: 999,  totalQuantity: 100 },
      { name: 'Professional',   price: 2499, totalQuantity: 150 },
      { name: 'Team of 4',      price: 7999, totalQuantity: 25  },
    ],
    tags: ['workshop', 'tech', 'career', 'learning'],
    stockUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=85',
  },
  {
    title: 'Festival Season Is Here',
    category: 'festival',
    tagline: 'CELEBRATE CULTURE, MUSIC & UNFORGETTABLE EXPERIENCES',
    description:
      'Live performances, cultural activities, local experiences and memorable moments — every festival tells a story. A multi-stage weekend of music and craft.',
    venue: { city: 'Mumbai', state: 'Maharashtra', country: 'India', name: 'Mahalaxmi Festival Grounds' },
    daysAhead: 35,
    tiers: [
      { name: 'Single Day',  price: 1499, totalQuantity: 800 },
      { name: 'Weekend Pass', price: 2999, totalQuantity: 400 },
      { name: 'VIP Lounge',   price: 7999, totalQuantity: 80  },
    ],
    tags: ['festival', 'music', 'culture', 'live'],
    stockUrl:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1600&q=85',
  },
  {
    title: 'The Great Food Experience',
    category: 'food',
    tagline: 'TASTE THE BEST FLAVOURS FROM ACROSS INDIA',
    description:
      'Food festivals, celebrity chefs, street food and culinary experiences — where every bite creates a memory. A weekend-long food trail under fairy lights.',
    venue: { city: 'Delhi', state: 'Delhi', country: 'India', name: 'Lodhi Garden Food Quarter' },
    daysAhead: 18,
    tiers: [
      { name: 'Taster',     price: 799,  totalQuantity: 600 },
      { name: 'Gourmet',    price: 1799, totalQuantity: 300 },
      { name: 'Chef Table', price: 4999, totalQuantity: 40  },
    ],
    tags: ['food', 'festival', 'streetfood', 'delhi'],
    stockUrl:
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&q=85',
  },
];

async function uploadBanner(stockUrl, publicId) {
  const res = await cloudinary.uploader.upload(stockUrl, {
    folder: 'trylinqr/originals',
    public_id: publicId,
    overwrite: true,
    resource_type: 'image',
  });
  return res.secure_url;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

  // 1. Ensure the TryLinqr Originals organizer exists and is approved.
  let organizer = await User.findOne({ email: ORGANIZER.email });
  if (!organizer) {
    organizer = await User.create({
      name: ORGANIZER.name,
      email: ORGANIZER.email,
      passwordHash: await bcrypt.hash(ORGANIZER.password, 10),
      role: 'admin',
      orgName: ORGANIZER.orgName,
      orgDescription: ORGANIZER.orgDescription,
      isVerified: true,
      isApproved: true,
      isBanned: false,
    });
    console.log(`Created organizer: ${ORGANIZER.email} / ${ORGANIZER.password}`);
  } else {
    organizer.isVerified = true;
    organizer.isApproved = true;
    organizer.isBanned = false;
    organizer.role = organizer.role === 'superadmin' ? 'superadmin' : 'admin';
    organizer.orgName = ORGANIZER.orgName;
    organizer.orgDescription = ORGANIZER.orgDescription;
    await organizer.save();
    console.log(`Refreshed organizer: ${ORGANIZER.email}`);
  }

  // 2. Upload each banner to Cloudinary and upsert the event by slug.
  for (const ev of EVENTS) {
    const slug = slugFor(ev.title);
    console.log(`\n→ ${ev.title}`);
    console.log(`  uploading banner to Cloudinary…`);
    const bannerImage = await uploadBanner(ev.stockUrl, `originals_${slug}`);
    console.log(`  banner: ${bannerImage}`);

    const doc = {
      title: ev.title,
      slug,
      description: `${ev.tagline}\n\n${ev.description}`,
      category: ev.category,
      organizer: organizer._id,
      venue: ev.venue,
      startDate: daysFromNow(ev.daysAhead),
      endDate: daysFromNow(ev.daysAhead + 2),
      startTime: '18:00',
      endTime: '23:00',
      bannerImage,
      ticketTiers: ev.tiers.map((t) => ({
        _id: new mongoose.Types.ObjectId(),
        ...t,
        soldQuantity: 0,
        benefits: [],
      })),
      tags: [ev.category, 'trylinqr-originals', ...ev.tags],
      isFeatured: true,
      status: 'published',
      cancellationPolicy: 'Full refund up to 48 hours before the event start.',
    };

    const existing = await Event.findOne({ slug });
    if (existing) {
      await Event.updateOne({ _id: existing._id }, { $set: doc });
      console.log(`  updated existing event ${existing._id}`);
    } else {
      const created = await Event.create(doc);
      console.log(`  created event ${created._id}`);
    }
  }

  console.log('\n--- Done ---');
  console.log(`Organizer login: ${ORGANIZER.email} / ${ORGANIZER.password}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
