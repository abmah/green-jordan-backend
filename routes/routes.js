import express from "express"
import userRoutes from "./user.route.js"
import authRoutes from "./auth.route.js"
import postRoutes from "./post.route.js"
import challengesRoute from './challenge.route.js'
import teamRoutes from './team.route.js'

const router = express.Router()


const baseURL = "api/v1"


router.use(`/${baseURL}/users`, userRoutes)
router.use(`/${baseURL}/auth`, authRoutes)
router.use(`/${baseURL}/posts`, postRoutes)
router.use(`/${baseURL}/challenge`, challengesRoute)
router.use(`/${baseURL}/teams`, teamRoutes)


export default router;