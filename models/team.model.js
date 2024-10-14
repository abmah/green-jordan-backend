import mongoose from "mongoose";
import { Schema } from "mongoose";

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 50,
  },
  description: {
    type: String,
    max: 200,
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  joinRequests: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      requestDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Team", teamSchema);
