import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";


export const createPost = async (body, fileUrl) => {
  try {
    const newPost = new postModel({
      ...body,
      image: fileUrl
    });
    await newPost.save();
    return newPost;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (params, body) => {
  try {
    const updatedPost = await postModel.findById(params.id);
    if (body.userId === updatedPost.userId) {
      await postModel.updateOne({
        $set: body,
      });

      return updatedPost;
    } else {
      throw new Error("You can't update other's posts");
    }
  } catch (error) {
    throw error;
  }
};


export const deletePost = async (params, body) => {
  try {
    const deletedPost = await postModel.findById(params.id);
    if (body.userId === deletedPost.userId) {
      await postModel.findByIdAndDelete(params.id);
      return deletedPost;
    } else {
      throw new Error("You can only delete your posts");
    }
  } catch (error) {
    throw error;
  }
};


export const likeOrUnlikePost = async (params, body) => {
  try {
    const post = await postModel.findById(params.id);
    if (!post) {
      return null;
    }

    const liked = !post.likes.includes(body.userId);
    const updatedPost = await postModel.findByIdAndUpdate(
      params.id,
      liked ? { $push: { likes: body.userId } } : { $pull: { likes: body.userId } },
      { new: true }
    );

    return { post: updatedPost, liked };
  } catch (error) {
    throw error;
  }
};


export const getPost = async (params) => {
  try {
    const post = await postModel
      .findById(params.id)
      .populate("userId", "username profilePicture")
      .populate({
        path: 'comments.userId',
        select: 'username profilePicture'
      });

    return post;
  } catch (error) {
    throw error;
  }
}


export const getTimelinePosts = async (body) => {
  try {
    const currentUser = await userModel.findById(body.userId);
    const following = currentUser.followings || [];
    const allUsers = [...following, body.userId];


    const posts = await postModel
      .find({ userId: { $in: allUsers } })
      .populate("userId", "username profilePicture")
      .populate({
        path: 'comments.userId',
        select: 'username profilePicture'
      });

    return posts;
  } catch (error) {
    throw error;
  }
};


export const getAllTimelinePosts = async () => {
  try {

    const posts = await postModel
      .find()
      .populate("userId", "username profilePicture")
      .populate({
        path: 'comments.userId',
        select: 'username profilePicture'
      });

    return posts;
  } catch (error) {
    throw error;
  }
};


export const getUserPosts = async (userId) => {
  try {
    const posts = await postModel
      .find({ userId }) // Use userId to find posts by the user
      .populate("userId", "username profilePicture")
      .populate({
        path: 'comments.userId',
        select: 'username profilePicture',
      });

    return posts;
  } catch (error) {
    throw error;
  }
};

