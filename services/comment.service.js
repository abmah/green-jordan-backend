// comment.service.js
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const addComment = async (postId, commentData) => {
  try {
    const user = await userModel.findById(commentData.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const commentWithUsername = {
      userId: commentData.userId,
      text: commentData.text,
      username: user.username
    };

    const post = await postModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    post.comments.push(commentWithUsername);
    await post.save();

    return commentWithUsername;
  } catch (error) {
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    return post.comments;
  } catch (error) {
    throw error;
  }
};
