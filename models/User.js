import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'customer'],
      default: 'customer',
    },
    phone: { type: String, trim: true },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true }, // admins set to false until approved
    isBanned: { type: Boolean, default: false },
    rejectionReason: { type: String },
    orgName: { type: String, trim: true },
    orgDescription: { type: String },
    razorpayAccountId: { type: String },
    verifyToken: { type: String },
    // Organizer payout details — collected on /dashboard/payouts.
    bankAccount: {
      accountHolderName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifsc: { type: String, trim: true, uppercase: true },
      bankName: { type: String, trim: true },
      branch: { type: String, trim: true },
      panNumber: { type: String, trim: true, uppercase: true },
      upiId: { type: String, trim: true },
      // Verification proofs uploaded to Cloudinary (PDF or image)
      cancelledChequeUrl: { type: String, trim: true },
      cancelledChequeName: { type: String, trim: true },
      accountStatementUrl: { type: String, trim: true },
      accountStatementName: { type: String, trim: true },
      verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified',
      },
      verificationNote: { type: String },
      updatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

UserSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.verifyToken;
  return obj;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
