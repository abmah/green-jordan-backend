import express from "express"
import { createPostController, deletePostController, likeOrUnlikePostController, updatePostController, getPostController, getTimelinePostsController } from "../controllers/post.controller.js";
import { parser } from "../config/cloudinary.js";
const router = express.Router()



router.post('/create-post', parser.single("img"), createPostController)

router.put("/update-post/:id", updatePostController)


router.delete("/delete-post/:id", deletePostController)


router.put("/like-post/:id", likeOrUnlikePostController)


router.get("/get-post/:id", getPostController)


router.get("/get-timeline-posts", getTimelinePostsController)





export default router;