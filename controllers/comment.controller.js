import { addComment, getComments } from "../services/comment.service.js";

export const addCommentController = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const commentData = {
      userId: req.body.userId,
      text: req.body.text,
    };

    const comments = await addComment(postId, commentData);
    res.status(200).json({
      message: "Comment added successfully",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsController = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const comments = await getComments(postId);

    res.status(200).json({
      message: "Comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};
