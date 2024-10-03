import {
  createPost,
  deletePost,
  likeOrUnlikePost,
  updatePost,
  getPost,
  getTimelinePosts,
  getAllTimelinePosts
} from "../services/post.service.js";

export const createPostController = async (req, res) => {
  try {
    // Access the file's Cloudinary secure URL here
    const fileUrl = req.file?.path || req.file?.secure_url;

    if (!fileUrl) {
      return res.status(400).json({
        message: "Image upload failed",
      });
    }

    const newPost = await createPost(req.body, fileUrl);
    res.status(200).json({
      message: "Post created successfully",
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
    // post to be edited // user id
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
    // post to be edited // user id
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
