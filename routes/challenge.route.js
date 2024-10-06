import express from "express";
import {
  createChallenge,
  assignDailyChallenges,
  getAvailableFreeChallenges,
  completeChallenge,
  updateChallenge,
  deleteChallenge,
  populateChallengesFromFile,
  getLeaderboard,
} from "../controllers/challenge.controller.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.post("/daily", assignDailyChallenges);
router.post("/free", getAvailableFreeChallenges);
// router.post("/complete/:challengeId", completeChallenge); its handled in post route
router.post("/create", createChallenge);
router.post("/populate", populateChallengesFromFile);
router.put("/update/:id", updateChallenge);
router.delete("/delete/:id", deleteChallenge);

export default router;
