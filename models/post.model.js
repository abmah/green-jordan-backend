import mongoose from "mongoose";
import { Schema } from "mongoose";



const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  },
}, { timestamps: true });


const postSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
    required: true
  },
  likes: {
    type: Array,
    default: []
  },
  comments: [commentSchema],
}, {
  timestamps: true
});


export default mongoose.model("Post", postSchema);
