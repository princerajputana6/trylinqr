/* Standalone seed script — run with: npm run seed */
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error('MONGODB_URI not set in .env.local');
  process.exit(1);
}

function slugify(t) {
  return (
    String(t)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 7)
  );
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: String,
    phone: String,
    avatar: String,
    isVerified: Boolean,
    isApproved: Boolean,
    isBanned: Boolean,
    orgName: String,
    orgDescription: String,
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

async function run() {
  await mongoose.connect(URI);
  console.log('Connected to MongoDB');

  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
  const Booking =
    mongoose.models.Booking ||
    mongoose.model('Booking', new mongoose.Schema({}, { strict: false, timestamps: true }));
  const Review =
    mongoose.models.Review ||
    mongoose.model('Review', new mongoose.Schema({}, { strict: false, timestamps: true }));

  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Booking.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const hash = (p) => bcrypt.hashSync(p, 10);

  const superadmin = await User.create({
    name: 'Platform Admin',
    email: 'super@trylinqr.com',
    passwordHash: hash('super1234'),
    role: 'superadmin',
    isVerified: true,
    isApproved: true,
  });

  const admins = await User.create([
    {
      name: 'Riya Kapoor',
      email: 'organizer@trylinqr.com',
      passwordHash: hash('admin1234'),
      role: 'admin',
      isVerified: true,
      isApproved: true,
      orgName: 'Pulse Events Co.',
      orgDescription: 'Curating unforgettable live experiences since 2018.',
    },
    {
      name: 'Arjun Mehta',
      email: 'rider@trylinqr.com',
      passwordHash: hash('admin1234'),
      role: 'admin',
      isVerified: true,
      isApproved: true,
      orgName: 'Highway Riders Club',
      orgDescription: 'Weekend bike rides and adventure trails.',
    },
    {
      name: 'Pending Organizer',
      email: 'pending@trylinqr.com',
      passwordHash: hash('admin1234'),
      role: 'admin',
      isVerified: true,
      isApproved: false,
      orgName: 'Fresh Start Productions',
      orgDescription: 'New to the platform — awaiting approval.',
    },
  ]);

  const customers = await User.create([
    {
      name: 'Sneha Sharma',
      email: 'customer@trylinqr.com',
      passwordHash: hash('user1234'),
      role: 'customer',
      isVerified: true,
      isApproved: true,
    },
    {
      name: 'Vikram Singh',
      email: 'vikram@trylinqr.com',
      passwordHash: hash('user1234'),
      role: 'customer',
      isVerified: true,
      isApproved: true,
    },
  ]);

  const banners = [
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=70',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=70',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=70',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=70',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=70',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=70',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&q=70',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=70',
  ];

  const cities = ['Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Jaipur', 'Goa'];
  const dayFromNow = (d) => new Date(Date.now() + d * 86400000);

  const eventSeeds = [
    {
      title: 'Sunburn Arena ft. Headliner Night',
      category: 'concert',
      organizer: admins[0]._id,
      featured: true,
      tiers: [
        { name: 'General', price: 999, totalQuantity: 300 },
        { name: 'VIP', price: 2499, totalQuantity: 80, benefits: ['Front stage', 'Free drinks'] },
      ],
    },
    {
      title: 'Himalayan Sunrise Bike Ride',
      category: 'bike-ride',
      organizer: admins[1]._id,
      featured: true,
      tiers: [{ name: 'Rider Pass', price: 0, totalQuantity: 40 }],
    },
    {
      title: 'Startup Growth Workshop 2026',
      category: 'workshop',
      organizer: admins[0]._id,
      featured: false,
      tiers: [
        { name: 'Standard', price: 499, totalQuantity: 120 },
        { name: 'Mentorship', price: 1499, totalQuantity: 25, benefits: ['1:1 mentor session'] },
      ],
    },
    {
      title: 'Maha Jagran Night — Devotional Gathering',
      category: 'jagran',
      organizer: admins[0]._id,
      featured: true,
      tiers: [{ name: 'Entry', price: 0, totalQuantity: 500 }],
    },
    {
      title: 'City Marathon — Run for a Cause',
      category: 'sports',
      organizer: admins[1]._id,
      featured: false,
      tiers: [
        { name: '5K Run', price: 299, totalQuantity: 400 },
        { name: '10K Run', price: 499, totalQuantity: 200 },
      ],
    },
    {
      title: 'Standup Comedy — Laugh Riot Live',
      category: 'comedy',
      organizer: admins[0]._id,
      featured: true,
      tiers: [{ name: 'Regular', price: 599, totalQuantity: 150 }],
    },
    {
      title: 'Street Food Carnival',
      category: 'food',
      organizer: admins[0]._id,
      featured: false,
      tiers: [{ name: 'Food Pass', price: 199, totalQuantity: 600 }],
    },
    {
      title: 'Holi Festival of Colors',
      category: 'festival',
      organizer: admins[1]._id,
      featured: true,
      tiers: [
        { name: 'Standard', price: 349, totalQuantity: 800 },
        { name: 'Premium', price: 799, totalQuantity: 150, benefits: ['Organic colors', 'Lounge access'] },
      ],
    },
  ];

  const events = [];
  for (let i = 0; i < eventSeeds.length; i++) {
    const s = eventSeeds[i];
    const e = await Event.create({
      title: s.title,
      slug: slugify(s.title),
      description: `${s.title} — a must-attend experience on TryLinqr. Join hundreds of attendees for an unforgettable time. Tickets are limited, so book early!`,
      category: s.category,
      organizer: s.organizer,
      venue: {
        name: `${cities[i % cities.length]} Grounds`,
        address: '123 Event Street',
        city: cities[i % cities.length],
        state: 'India',
        pincode: '110001',
      },
      startDate: dayFromNow(3 + i * 4),
      startTime: '18:00',
      endTime: '23:00',
      bannerImage: banners[i % banners.length],
      galleryImages: [banners[(i + 1) % banners.length], banners[(i + 2) % banners.length]],
      ticketTiers: s.tiers.map((t) => ({
        _id: new mongoose.Types.ObjectId(),
        ...t,
        soldQuantity: 0,
        benefits: t.benefits || [],
      })),
      tags: [s.category, 'trylinqr', cities[i % cities.length].toLowerCase()],
      isFeatured: s.featured,
      status: 'published',
      totalViews: Math.floor(Math.random() * 800) + 50,
      cancellationPolicy: 'Full refund up to 48 hours before the event.',
    });
    events.push(e);
  }
  console.log(`Created ${events.length} events`);

  // a couple of bookings + reviews for the first event
  const first = events[0];
  const tier = first.ticketTiers[0];
  const booking = await Booking.create({
    bookingCode: 'TLQ-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
    customer: customers[0]._id,
    event: first._id,
    ticketTier: { tierId: String(tier._id), name: tier.name, price: tier.price },
    quantity: 2,
    totalAmount: tier.price * 2,
    platformFee: Math.round(tier.price * 2 * 0.05),
    paymentStatus: 'paid',
  });
  first.ticketTiers[0].soldQuantity = 2;
  await first.save();

  await Review.create({
    event: first._id,
    customer: customers[0]._id,
    rating: 5,
    comment: 'Incredible energy and great organization. Highly recommend!',
    isApproved: true,
  });
  await Event.findByIdAndUpdate(first._id, { rating: 5, reviewCount: 1 });

  console.log('Created sample booking and review');
  console.log('\n--- Seed complete ---');
  console.log('Super Admin : super@trylinqr.com / super1234');
  console.log('Organizer   : organizer@trylinqr.com / admin1234');
  console.log('Organizer 2 : rider@trylinqr.com / admin1234');
  console.log('Customer    : customer@trylinqr.com / user1234');

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
