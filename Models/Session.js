import mongoose, { Schema } from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    cinema: Object,
    cinemaId: String,
    movie: Object,
    times: [{ type: Schema.Types.ObjectId, ref: "SessionItem" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Session", SessionSchema);
