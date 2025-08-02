// models/HomepageSettings.js

import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema(
  {
    heroImageUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    mainHeading: {
      type: String,
      default: "10,000+ Graphic Resources For Free Download",
    },
    subHeading: {
      type: String,
      default: "Find the best products at the best prices",
    },
  },
  { timestamps: true }
);

const HomepageSettings =
  mongoose.models.HomepageSettings ||
  mongoose.model("HomepageSettings", homepageSchema);

export default HomepageSettings;
