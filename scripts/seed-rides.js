/*
 * Seeds Angels & Roadsters as an approved organizer + two sample bike-ride
 * events that mirror the user-supplied posters:
 *   1. Sunday Content & Breakfast Ride (single-day, free)
 *   2. Mashobra Ride 2026 (3-day, ₹4,299)
 *
 * Run with:  npm run seed:rides
 * Re-runs are safe — the organizer is upserted and existing
 * Angels & Roadsters bike-ride events with the same slugs are skipped.
 */
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
    Math.random().toString(36).slice(2, 6)
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

// strict:false so any extra fields we pass (rideDetails, etc.) are saved
const eventSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

async function run() {
  await mongoose.connect(URI);
  console.log('▶︎ Connected to MongoDB');

  const User = mongoose.models.User || mongoose.model('User', userSchema);
  const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

  // 1. Upsert the organizer
  let organizer = await User.findOne({ email: 'angels.roadsters@trylinqr.test' });
  if (!organizer) {
    const passwordHash = await bcrypt.hash('riders@2026', 10);
    organizer = await User.create({
      name: 'Angels & Roadsters',
      email: 'angels.roadsters@trylinqr.test',
      passwordHash,
      role: 'admin',
      phone: '+91 98xx xxxxxx',
      isVerified: true,
      isApproved: true,
      isBanned: false,
      orgName: 'Angels & Roadsters',
      orgDescription:
        'Delhi-NCR riding community curating sunrise breakfast rides, weekend escapes and multi-day touring expeditions.',
      avatar:
        'https://ui-avatars.com/api/?name=Angels+Roadsters&background=710014&color=fff&bold=true&size=160',
    });
    console.log('✓ Created organizer Angels & Roadsters');
  } else {
    console.log('✓ Organizer Angels & Roadsters already exists');
  }

  // 2. Define the two rides
  const rides = [
    {
      title: 'Sunday Content & Breakfast Ride',
      // 24 May 2026, 05:30 IST → 00:00 UTC on 24 May (close enough for sorting)
      startDate: new Date('2026-05-24T00:00:00.000Z'),
      endDate: new Date('2026-05-24T05:00:00.000Z'),
      startTime: '05:30',
      endTime: '10:00',
      description:
        'Join the Angels & Roadsters Sunday Content & Breakfast Ride — a sunrise sprint from Malviya Nagar to Panchgaon for a hot breakfast with the crew. Meetup at Super Chai sharp at 5 AM; ride wheels-out at 5:30. Bring your gear, bring your story — we ride together, we eat together.',
      venue: {
        name: 'Super Chai',
        address: 'Malviya Nagar',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110017',
      },
      bannerImage:
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&q=75',
      galleryImages: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=75',
        'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=1200&q=75',
      ],
      ticketTiers: [
        {
          name: 'Rider',
          price: 0,
          totalQuantity: 60,
          soldQuantity: 0,
          description: 'Bring your bike and your gear. Breakfast is on you.',
          benefits: ['Group ride coordination', 'Sweep + lead rider', 'Live route share'],
        },
      ],
      tags: ['sunday-ride', 'breakfast-ride', 'delhi-ncr', 'morning'],
      ageRestriction: '18+',
      dressCode: 'Full riding gear mandatory',
      cancellationPolicy:
        'Free to cancel up to 12 hours before the ride. After that the slot is held for waitlisted riders.',
      rideDetails: {
        meetupTime: '05:00',
        rideStartTime: '05:30',
        rideTill: 'Panchgaon, Gurugram, Haryana',
        distanceKm: 65,
        durationDays: 1,
        difficulty: 'easy',
        pillionAllowed: true,
        mandatoryDocuments: ['RC', 'DL', 'Insurance', 'Pollution'],
        mandatoryGears: ['Helmet', 'Gloves', 'Knee Guards', 'Elbow Guards', 'Riding Boots'],
        fuelPolicy:
          'Tanks topped up before meetup — there are no fuel stops in-between.',
        rideNotes:
          'The ride will leave at ride-off time, leaving behind anyone who is not there. We will share the live location on the main group so you can catch up later. Pillion riders must also be in full gear.',
      },
    },
    {
      title: 'Mashobra Ride 2026',
      // 22 May 2026 → 24 May 2026
      startDate: new Date('2026-05-22T00:00:00.000Z'),
      endDate: new Date('2026-05-24T00:00:00.000Z'),
      startTime: '04:30',
      description:
        'Three days, two nights of misty pine forests, twisty mountain tarmac and quiet Himalayan mornings. Mashobra Ride 2026 is a fully coordinated touring expedition with stay, meals and on-ground support handled — so you can focus on the throttle and the view.',
      venue: {
        name: 'Mashobra Hills',
        address: 'Mashobra, Shimla District',
        city: 'Shimla',
        state: 'Himachal Pradesh',
        pincode: '171007',
      },
      bannerImage:
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=75',
      galleryImages: [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=75',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=75',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=75',
      ],
      ticketTiers: [
        {
          name: 'Triple Sharing',
          price: 4299,
          totalQuantity: 18,
          soldQuantity: 3,
          description: 'Triple-sharing room with all meals and ride support.',
          benefits: [
            '2 Nights Stay',
            'Breakfast & Dinner Included',
            'Group Ride Experience',
            'Ride Coordination & Support',
          ],
        },
        {
          name: 'Double Sharing',
          price: 5499,
          totalQuantity: 8,
          soldQuantity: 0,
          description: 'Double-sharing room upgrade.',
          benefits: [
            '2 Nights Stay (double sharing)',
            'Breakfast & Dinner Included',
            'Group Ride Experience',
            'Ride Coordination & Support',
          ],
        },
      ],
      tags: ['himalayan-tour', 'mashobra', 'multi-day', 'shimla'],
      ageRestriction: '21+',
      dressCode: 'Full riding gear · ride-friendly luggage only',
      cancellationPolicy:
        '50% refund up to 14 days before departure. No refunds within 14 days; slot is transferable to another rider with prior notice.',
      isFeatured: true,
      rideDetails: {
        meetupTime: '04:00',
        rideStartTime: '04:30',
        rideTill: 'Mashobra, Himachal Pradesh',
        distanceKm: 360,
        durationDays: 3,
        difficulty: 'challenging',
        pillionAllowed: true,
        mandatoryDocuments: ['RC', 'DL', 'Insurance', 'Pollution'],
        mandatoryGears: [
          'Helmet',
          'Riding Jacket',
          'Gloves',
          'Knee Guards',
          'Elbow Guards',
          'Riding Boots',
        ],
        fuelPolicy:
          'Pre-planned fuel stops at Murthal, Karnal and Solan. Top up at every stop — no detours.',
        inclusions: [
          '2 Nights Stay (Triple Sharing)',
          'Breakfast & Dinner Included',
          'Group Ride Experience',
          'Ride Coordination & Support',
          'Backup support vehicle',
        ],
        rideNotes:
          'Limited slots — book early. Riders are expected to keep formation and follow the lead rider. Briefing happens at meetup; late arrivals will be left behind and asked to catch up via live location share.',
      },
    },
  ];

  for (const r of rides) {
    const existing = await Event.findOne({
      organizer: organizer._id,
      title: r.title,
    });
    if (existing) {
      console.log(`• Skipped — "${r.title}" already seeded (${existing.slug})`);
      continue;
    }
    const event = await Event.create({
      ...r,
      slug: slugify(r.title),
      category: 'bike-ride',
      organizer: organizer._id,
      status: 'published',
      totalViews: Math.floor(Math.random() * 200) + 50,
    });
    console.log(`✓ Seeded "${event.title}" → /events/${event.slug}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
