import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    max: 200,
  },
  from: {
    type: Number,
    enum: [
      1, // Jerash
      2, // Irbid
      3, // Amman
      4, // Zarqa
      5, // Balqa
      6, // Mafraq
      7, // Ajloun
      8, // Madaba
      9, // Karak
      10, // Tafila
      11, // Ma'an
      12, // Aqaba
    ],
  },
  followings: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  points: {
    type: Number,
    default: 0,
  },
  allTimePoints: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastChallengeCompleted: {
    type: Date,
    default: null,
  },
  completedChallenges: [
    {
      challengeId: {
        type: Schema.Types.ObjectId,
        ref: "Challenge",
      },
      completedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  dailyChallengesAssigned: [
    {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
    },
  ],
  lastDailyAssignedAt: {
    type: Date,
    default: null,
  },
  lastFreeChallengeClaimedAt: {
    type: Date,
    default: null,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    default: null,
  },
  redeemedItems: [
    {
      redeemableId: {
        type: Schema.Types.ObjectId,
        ref: 'Redeemable',
      },
      redeemedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("User", userSchema);
