import mongoose from "mongoose";

const CinemasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    movies: Array,
    area: String,
    category: String,
    intesity: Number,
    sessions: Array,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cinemas", CinemasSchema);
