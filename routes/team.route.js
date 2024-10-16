import express from "express";
import {
  createTeamController,
  updateTeamController,
  deleteTeamController,
  getTeamController,
  joinTeamRequestController,
  acceptJoinRequestController,
  rejectJoinRequestController,
  removeMemberController,
  leaveTeamController,
  getTeamMembersController,
  getUserTeamController,
  getAllTeamsController,
  getTeamPostsController,
} from "../controllers/team.controller.js";

const router = express.Router();

// Route to create a new team (only accessible by users not in a team)
router.post("/", createTeamController);

// Route to update team details (name, description) by the team admin
router.put("/:id", updateTeamController);

// Route to delete a team (only accessible by the team admin)
router.delete("/:id", deleteTeamController);

// Route to get details of a specific team
router.get("/:id", getTeamController);

// Route to get User team
router.get("/get-user-team/:id", getUserTeamController);

// Route for a user to send a join request to a team
router.post("/request-join/:teamId", joinTeamRequestController);

// Route for a team admin to accept a user's join request
router.put("/accept-request/:teamId/:userId", acceptJoinRequestController);

// Route for a team admin to reject a user's join request
router.put("/reject-request/:teamId/:userId", rejectJoinRequestController);

// Route for a team admin to remove a member from the team
router.put("/remove-member/:teamId/:userId", removeMemberController);

// // Route for a user to leave the team they are in
router.put("/leave-team/:teamId", leaveTeamController);

// // Route to get the list of members in a team
router.get("/members/:teamId", getTeamMembersController);

// Route to get list of all teams
router.get("/", getAllTeamsController);

// Route to get posts from all team members
router.get("/posts/:teamId", getTeamPostsController);

export default router;
