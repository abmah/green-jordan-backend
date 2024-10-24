import express from "express";
import {
  createPostController,
  deletePostController,
  likeOrUnlikePostController,
  updatePostController,
  getPostController,
  getTimelinePostsController,
  getAllTimelinePostsController,
  getUserPostsController
} from "../controllers/post.controller.js";

import {
  addCommentController,
  getCommentsController,
} from "../controllers/comment.controller.js";
import { parser } from "../config/cloudinary.js";
const router = express.Router();

router.post("/create-post", parser.single("img"), createPostController);
router.put("/update-post/:id", updatePostController);
router.delete("/delete-post/:id", deletePostController);
router.put("/like-post/:id", likeOrUnlikePostController);
router.get("/get-post/:id", getPostController);
router.get("/get-timeline-posts/:userId", getTimelinePostsController);
router.get("/get-all-posts", getAllTimelinePostsController);
router.get('/get-user-posts/:id', getUserPostsController);




router.post('/comments/:id', addCommentController);
router.get('/comments/:id', getCommentsController);



export default router;
