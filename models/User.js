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
