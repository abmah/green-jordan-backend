import express from "express"
import { login, register, updatePassword } from "../controllers/auth.controller.js";

const router = express.Router()


router.post("/register", register)
router.post("/login", login)
router.put("/update-password/:id", updatePassword);


export default router;