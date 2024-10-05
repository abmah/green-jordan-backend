import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const addComment = async (postId, commentData) => {
  try {
    const user = await userModel.findById(commentData.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const commentWithUserInfo = {
      userId: commentData.userId,
      text: commentData.text,

      username: user.username,
      profilePicture: user.profilePicture || ""
    };

    const post = await postModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    post.comments.push(commentWithUserInfo);
    await post.save();

    return commentWithUserInfo;
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


    const commentsWithUserInfo = await Promise.all(
      post.comments.map(async (comment) => {
        const user = await userModel.findById(comment.userId);
        return {
          ...comment._doc,
          username: user.username,
          profilePicture: user.profilePicture || "",
        };
      })
    );

    return commentsWithUserInfo;
  } catch (error) {
    throw error;
  }
};
