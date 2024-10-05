import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const challengeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  points: {
    type: Number,
    required: true,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
  isDaily: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Challenge', challengeSchema);
