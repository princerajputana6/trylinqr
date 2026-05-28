import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'superadmin', 'system'],
      required: true,
    },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const SupportTicketSchema = new mongoose.Schema(
  {
    ticketCode: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['booking', 'payment', 'ticket', 'event', 'account', 'general'],
      default: 'general',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    relatedBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    // routing: tickets start with superadmin; superadmin may forward to a specific organizer
    assignedRole: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'superadmin',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    forwardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    forwardedReason: { type: String },
    assignedAt: { type: Date, default: Date.now },
    autoEscalated: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    resolvedAt: { type: Date },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    messages: [MessageSchema],
    customerUnread: { type: Number, default: 0 },
    handlerUnread: { type: Number, default: 1 }, // counts unread for current handler
  },
  { timestamps: true }
);

SupportTicketSchema.index({ status: 1, assignedRole: 1, assignedTo: 1 });

export default mongoose.models.SupportTicket ||
  mongoose.model('SupportTicket', SupportTicketSchema);
