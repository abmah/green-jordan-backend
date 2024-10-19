import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const redeemableSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  cost: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Redeemable', redeemableSchema);
