import mongoose from 'mongoose';

const TicketTierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0, min: 0 },
    totalQuantity: { type: Number, required: true, min: 1 },
    soldQuantity: { type: Number, default: 0, min: 0 },
    description: { type: String },
    benefits: [{ type: String }],
  },
  { _id: true }
);

// Used only when category === 'bike-ride'. Captures the structured
// info bike-ride organizers typically advertise (meetup vs ride-off,
// mandatory paperwork & gear, distance, fuel policy, etc.).
const RideDetailsSchema = new mongoose.Schema(
  {
    meetupTime: { type: String },            // "05:00 AM"
    rideStartTime: { type: String },         // "05:30 AM" (sharp)
    rideTill: { type: String },              // "Panchgaon, Gurugram, HR"
    distanceKm: { type: Number },
    durationDays: { type: Number },          // for multi-day rides
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'challenging', 'expert'],
    },
    pillionAllowed: { type: Boolean, default: true },
    mandatoryDocuments: [{ type: String }],  // RC, DL, Insurance, Pollution
    mandatoryGears: [{ type: String }],      // Helmet, Gloves, Knee Guards…
    fuelPolicy: { type: String },            // "Fuelled up — no fuel stops in-between"
    inclusions: [{ type: String }],          // Stay, Breakfast, Dinner, Coordination…
    rideNotes: { type: String },             // Ride-off note, group rules
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: [
        'bike-ride',
        'jagran',
        'function',
        'concert',
        'workshop',
        'sports',
        'festival',
        'exhibition',
        'food',
        'comedy',
        'corporate',
        'other',
      ],
      required: true,
      index: true,
    },
    subCategory: { type: String },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    venue: {
      name: String,
      address: String,
      city: { type: String, index: true },
      state: String,
      country: String,
      pincode: String,
      lat: Number,
      lng: Number,
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    bannerImage: { type: String },
    galleryImages: [{ type: String }],
    promoVideo: { type: String },
    ticketTiers: [TicketTierSchema],
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'cancelled', 'completed'],
      default: 'draft',
      index: true,
    },
    ageRestriction: { type: String },
    dressCode: { type: String },
    cancellationPolicy: { type: String },
    rideDetails: { type: RideDetailsSchema, default: undefined },
    totalViews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EventSchema.index({ title: 'text', description: 'text', tags: 'text' });

EventSchema.virtual('minPrice').get(function () {
  if (!this.ticketTiers?.length) return 0;
  return Math.min(...this.ticketTiers.map((t) => t.price));
});

EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
