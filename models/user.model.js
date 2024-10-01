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
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  },

  coverPicture: {
    type: String,
    default: ""
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  desc: {
    type: String,
    max: 50
  },
  from: {
    type: Number,
    // required: true,
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
      12  // Aqaba
    ]
  },

  followings: {
    type: Array,
    default: []
  },
  followers: {
    type: Array,
    default: []
  },
  points: {
    type: Number,
    default: 0
  },

  allTimePoints: {
    type: Number,
    default: 0

  }


})


export default mongoose.model("User", userSchema)