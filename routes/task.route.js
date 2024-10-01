
import express from "express"
import { doTaskController, leaderboardController } from "../controllers/task.controller.js";



const router = express.Router()


router.get("/do-task", doTaskController)
router.get('/leaderboard', leaderboardController)



export default router;