import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // made optional
  mobile: { type: Number }, // made optional
  profileImage: {
    type: String,
    default:
      "https://res.cloudinary.com/drhhwftek/image/upload/v1751651164/vecteno_uploads/x7whkifa4fcrxt8gyhdv.png",
  },
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },

  // Optional fields for password reset
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Date, default: null },

  // ✅ Google login support
  isGoogleUser: { type: Boolean, default: false },
});

delete mongoose.connection.models["User"];
const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
