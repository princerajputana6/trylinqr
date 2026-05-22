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
