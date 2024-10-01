import mongoose from "mongoose";
import { Schema } from "mongoose";

const postSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ""
  },
  likes: {
    type: Array,
    default: []
  },
},
  {
    timestamps: true
  }
)


export default mongoose.model("Post", postSchema)

