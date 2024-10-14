import {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
  sendJoinRequest,
  acceptJoinRequest,
  rejectJoinRequest,
  removeMember,
  leaveTeam,
  getTeamMembers,
  getUserTeam,
  getAllTeams,
} from "../services/team.service.js";

// Controller to create a new team
export const createTeamController = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const team = await createTeam(userId, req.body);
    res.status(201).json({
      message: "Team created successfully.",
      data: team,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating team.",
      error: error.message,
    });
  }
};

// Controller to update a team
export const updateTeamController = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { userId } = req.body;

    const team = await getTeamById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // const isUserAdmin = await User.findById(userId).isAdmin; // Uncomment for future use
    const isUserAdmin = team.admin.toString() === userId;

    if (isUserAdmin) {
      const updatedTeam = await updateTeam(teamId, req.body);
      return res.status(200).json({
        message: "Team updated successfully.",
        data: updatedTeam,
      });
    } else {
      return res.status(403).json({ message: "Only team admins can update the team." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating team.",
      error: error.message,
    });
  }
};

// Controller to delete a team
export const deleteTeamController = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { userId } = req.body;

    const team = await getTeamById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // const isUserAdmin = await User.findById(userId).isAdmin; // Uncomment for future use
    if (team.admin.toString() === userId) {
      await deleteTeam(teamId);
      return res.status(200).json({ message: "Team deleted successfully." });
    } else {
      return res.status(403).json({ message: "Only team admins can delete the team." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting team.",
      error: error.message,
    });
  }
};

// Controller to get team details
export const getTeamController = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.body.userId;

    const team = await getTeamById(teamId, userId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    res.status(200).json({
      message: "Team fetched successfully.",
      data: team,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching team.",
      error: error.message,
    });
  }
};

// Controller to get user team
export const getUserTeamController = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed in the route parameters
    const team = await getUserTeam(userId);

    res.status(200).json({
      message: "User team fetched successfully.",
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user team.",
      error: error.message,
    });
  }
};

// Controller to send a join request
export const joinTeamRequestController = async (req, res) => {
  try {
    const { userId } = req.body;

    const { teamId } = req.params

    if (!userId || !teamId) {
      return res.status(400).json({ message: "Team ID and User ID are required." });
    }

    const result = await sendJoinRequest(teamId, userId);
    res.status(200).json({
      message: "Join request sent successfully.",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error sending join request.",
      error: error.message,
    });
  }
};

// Controller to accept a join request
export const acceptJoinRequestController = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.params.userId;
    const adminId = req.body.userId;

    const team = await getTeamById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    if (team.admin.toString() === adminId) {
      const result = await acceptJoinRequest(teamId, userId);
      res.status(200).json({
        message: "Join request accepted.",
        data: result,
      });
    } else {
      return res.status(403).json({ message: "Only team admins can accept join requests." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error accepting join request.",
      error: error.message,
    });
  }
};

// Controller to reject a join request
export const rejectJoinRequestController = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.params.userId;
    const adminId = req.body.userId;

    const team = await getTeamById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    if (team.admin.toString() === adminId) {
      const result = await rejectJoinRequest(teamId, userId);
      res.status(200).json({
        message: "Join request rejected.",
        data: result,
      });
    } else {
      return res.status(403).json({ message: "Only team admins can reject join requests." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error rejecting join request.",
      error: error.message,
    });
  }
};

// Controller to remove a member from the team
export const removeMemberController = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.params.userId;
    const adminId = req.body.userId;

    const team = await getTeamById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    if (team.admin.toString() === adminId) {
      const result = await removeMember(teamId, userId);
      res.status(200).json({
        message: "Member removed successfully.",
        data: result,
      });
    } else {
      return res.status(403).json({ message: "Only team admins can remove members." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error removing member.",
      error: error.message,
    });
  }
};

// Controller to allow a user to leave a team
export const leaveTeamController = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.body.userId;

    if (!teamId || !userId) {
      return res.status(400).json({ message: "Team ID and User ID are required." });
    }

    const team = await getTeamById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Check if the user is a member of the team
    const isMember = team.members.some(memberId => memberId.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this team." });
    }

    // If user is the admin, they cannot leave (unless team is deleted)
    if (team.admin.toString() === userId) {
      return res.status(403).json({ message: "Team admins cannot leave the team." });
    }

    // Remove the user from the team
    const updatedTeam = await leaveTeam(teamId, userId);
    return res.status(200).json({
      message: "You have successfully left the team.",
      data: updatedTeam,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error leaving the team.",
      error: error.message,
    });
  }
};

// Controller to get all members of a team
export const getTeamMembersController = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const team = await getTeamById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Fetch team members
    const members = await getTeamMembers(teamId);
    return res.status(200).json({
      message: "Team members fetched successfully.",
      data: members,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching team members.",
      error: error.message,
    });
  }
};


export const getAllTeamsController = async (req, res) => {
  try {
    const teams = await getAllTeams();
    return res.status(200).json({
      message: "Teams fetched successfully.",
      data: teams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching teams.",
      error: error.message,
    });
  }
};