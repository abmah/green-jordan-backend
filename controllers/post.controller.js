import {
  createPost,
  deletePost,
  likeOrUnlikePost,
  updatePost,
  getPost,
  getTimelinePosts,
  getAllTimelinePosts,
  getUserPosts
} from "../services/post.service.js";



import userModel from "../models/user.model.js";
import challengeModel from "../models/challenge.model.js";
import { completeChallengeService } from "../services/challenge.service.js";

export const createPostController = async (req, res) => {
  try {
    const { userId, challengeId } = req.body;

    if (!userId || !challengeId) {
      return res.status(400).json({
        message: "User ID and Challenge ID are required.",
      });
    }


    const user = await userModel.findById(userId).populate("dailyChallengesAssigned");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const challenge = await challengeModel.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found." });
    }


    const assignedChallenge = user.dailyChallengesAssigned.find((c) =>
      c._id.equals(challengeId)
    );
    if (!assignedChallenge) {
      return res.status(403).json({
        message: "This challenge is not part of the assigned daily challenges.",
      });
    }

    const challengeCompleted = user.completedChallenges.some((c) =>
      c.challengeId.equals(challengeId)
    );
    if (challengeCompleted) {
      return res.status(403).json({
        message: "You have already completed this challenge.",
      });
    }


    const completionResponse = await completeChallengeService(userId, challengeId);

    const fileUrl = req.file?.path || req.file?.secure_url;
    if (!fileUrl) {
      return res.status(400).json({
        message: "Image upload failed",
      });
    }

    const newPost = await createPost(req.body, fileUrl);

    res.status(200).json({
      message: `Challenge completed and post created successfully for challenge: ${challenge.title}`,
      challengeDetails: {
        title: challenge.title,
        description: challenge.description,
        points: challenge.points,
        completionDetails: completionResponse,
      },
      data: newPost,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating post",
      error,
    });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const updatedPost = await updatePost(req.params, req.body);

    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating post",
      error,
    });
  }
};

export const deletePostController = async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params, req.body);

    res.status(200).json({
      message: "Post deleted successfully",
      data: deletedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting post",
      error,
    });
  }
};

export const likeOrUnlikePostController = async (req, res) => {
  try {
    const { post, liked } = await likeOrUnlikePost(req.params, req.body);

    if (!post) {

      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: `Post ${liked ? "liked" : "unliked"} successfully`,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error doing action",
      error,
    });
  }
};

export const getPostController = async (req, res) => {
  try {
    const post = await getPost(req.params);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: `Post fetched successfully`,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching post",
      error,
    });
  }
};

export const getTimelinePostsController = async (req, res) => {
  try {
    const timelinePosts = await getTimelinePosts(req.body);

    if (!timelinePosts || timelinePosts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({
      message: "Posts fetched successfully",
      data: timelinePosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
};


export const getAllTimelinePostsController = async (req, res) => {
  try {
    const allTimelinePosts = await getAllTimelinePosts();

    if (!allTimelinePosts || allTimelinePosts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.status(200).json({
      message: "Posts fetched successfully",
      data: allTimelinePosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
};


export const getUserPostsController = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request parameters

    const userPosts = await getUserPosts(id); // Fetch posts for this user

    // Check if there are no user posts
    if (!userPosts || userPosts.length === 0) {
      return res.status(200).json({ message: "No posts found for this user", data: [] });
    }

    res.status(200).json({
      message: "User posts fetched successfully",
      data: userPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user posts",
      error: error.message,
    });
  }
};
