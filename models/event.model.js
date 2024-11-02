import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  titleAR: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  descriptionAR: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  requiredParticipants: {
    type: Number,
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);