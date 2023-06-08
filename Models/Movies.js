import mongoose from "mongoose";

const MoviesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    year: Number,
    producer: String,
    operator: String,
    actors: String,
    genre: String,
    production: String,
    duration: String,
    bio: String,
    image: String,
    award: String,
    cinema: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Movies", MoviesSchema);
