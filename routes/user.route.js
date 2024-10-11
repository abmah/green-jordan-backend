import express from "express";
import {
  updateUserController,
  deleteUserController,
  getUserController,
  unfollowUserController,
  followUserController,
  updateProfilePictureController,
  getFullUserController
} from "../controllers/user.controller.js";
import { parser } from "../config/cloudinary.js";

const router = express.Router();

router.put("/:id", updateUserController);

router.delete("/:id", deleteUserController);

router.get("/:id", getUserController);

router.put("/follow/:id", followUserController);

router.put("/unfollow/:id", unfollowUserController);

router.put("/update-profile-picture/:id", parser.single("img"), updateProfilePictureController);


router.get('/get-full-user/:id', getFullUserController);


export default router;
