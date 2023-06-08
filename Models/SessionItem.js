import mongoose, { Schema } from "mongoose";

const SessionItemSchema = new mongoose.Schema(
  {
    data: String,
    time: String,
    hall: Number,
    good: Number,
    lux: Number,
    places: Array,
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("SessionItem", SessionItemSchema);
