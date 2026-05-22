import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true, index: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    ticketTier: {
      tierId: String,
      name: String,
      price: Number,
    },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true },
    platformFee: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    qrCode: { type: String },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
