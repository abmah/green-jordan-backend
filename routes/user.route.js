import express from "express"
import { updateUserController, deleteUserController, getUserController, unfollowUserController, followUserController } from "../controllers/user.controller.js"


const router = express.Router()




//UPDATE USER
router.put("/:id", updateUserController)

//DELETE USER
router.delete("/:id", deleteUserController);

//GET USER
router.get("/:id", getUserController);

// follow a user

router.put("/follow/:id", followUserController)


// unfollow a user

router.put("/unfollow/:id", unfollowUserController)





export default router;