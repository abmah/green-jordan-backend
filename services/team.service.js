import teamModel from "../models/team.model.js";
import userModel from "../models/user.model.js";

// Service to create a new team
export const createTeam = async (userId, teamData) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found.");

    // Check if the user is already a member of another team
    if (user.team) throw new Error("User is already a member of another team. Leave the current team before creating a new one.");

    const { name, description } = teamData;
    if (!name) throw new Error("Team name is required.");

    const newTeam = new teamModel({
      name,
      description,
      admin: userId,
      members: [userId],
    });

    await newTeam.save();

    user.team = newTeam._id; // Update user to reflect team membership
    await user.save();

    return newTeam;
  } catch (error) {
    throw new Error(`Failed to create team: ${error.message}`); // Improved error message
  }
};

// Service to update a team (only admin)
export const updateTeam = async (teamId, teamData) => {
  try {
    const team = await teamModel.findById(teamId);
    if (!team) throw new Error("Team not found.");

    const updatedTeam = await teamModel.findByIdAndUpdate(teamId, teamData, { new: true });
    return updatedTeam;
  } catch (error) {
    throw new Error(`Failed to update team: ${error.message}`); // Improved error message
  }
};

// Service to delete a team (only admin)
export const deleteTeam = async (teamId) => {
  try {
    const team = await teamModel.findById(teamId);
    if (!team) throw new Error("Team not found.");

    // Remove the team from all members' records
    await userModel.updateMany({ team: teamId }, { $unset: { team: "" } });

    await teamModel.findByIdAndDelete(teamId);
  } catch (error) {
    throw new Error(`Failed to delete team: ${error.message}`); // Improved error message
  }
};

// Service to get team by ID
export const getTeamById = async (teamId) => {
  try {
    const team = await teamModel.findById(teamId);
    if (!team) throw new Error("Team not found.");

    return team;
  } catch (error) {
    throw new Error(`Failed to fetch team: ${error.message}`); // Improved error message
  }
};

// service to get user team
export const getUserTeam = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found.");

    // Find a team where the user is a member or the admin
    const team = await teamModel.findOne({
      $or: [
        { members: userId }, // User is a member
        { admin: userId },   // User is the admin
      ],
    });

    // Return the team or a message if no team is found
    return team || { message: "No team found for this user." };
  } catch (error) {
    throw new Error(`Failed to fetch user team: ${error.message}`);
  }
};



// Service to send a join request
export const sendJoinRequest = async (teamId, userId) => {
  try {
    const team = await teamModel.findById(teamId);
    const user = await userModel.findById(userId);

    if (!team) throw new Error("Team not found.");
    if (!user) throw new Error("User not found.");

    // Check if the user is already a member of the team
    if (team.members.includes(userId)) {
      throw new Error("User is already a member of this team.");
    }

    // Check if user has already requested to join
    const alreadyRequested = team.joinRequests.some((request) => request.userId.equals(userId));
    if (alreadyRequested) throw new Error("Join request already sent.");

    // Add the user to the team's joinRequests array
    team.joinRequests.push({ userId });
    await team.save();

    return team;
  } catch (error) {
    throw new Error(`Failed to send join request: ${error.message}`); // Improved error message
  }
};

// Service to accept a join request (admin only)
export const acceptJoinRequest = async (teamId, userId) => {
  try {
    const team = await teamModel.findById(teamId);
    const user = await userModel.findById(userId);

    if (!team) throw new Error("Team not found.");
    if (!user) throw new Error("User not found.");

    // Check if the user is already a member of the team
    if (team.members.includes(userId)) {
      throw new Error("User is already a member of this team.");
    }

    // Remove the join request from the team
    team.joinRequests = team.joinRequests.filter((request) => !request.userId.equals(userId));

    // Add the user as a member
    team.members.push(userId);
    await team.save();

    // Update user to reflect team membership
    user.team = teamId;
    await user.save();

    return team;
  } catch (error) {
    throw new Error(`Failed to accept join request: ${error.message}`); // Improved error message
  }
};

// Service to reject a join request (admin only)
export const rejectJoinRequest = async (teamId, userId) => {
  try {
    const team = await teamModel.findById(teamId);
    if (!team) throw new Error("Team not found.");

    // Remove the join request from the team
    team.joinRequests = team.joinRequests.filter((request) => !request.userId.equals(userId));
    await team.save();

    return team;
  } catch (error) {
    throw new Error(`Failed to reject join request: ${error.message}`); // Improved error message
  }
};

// Service to remove a member from the team (admin only)
export const removeMember = async (teamId, memberId) => {
  try {
    const team = await teamModel.findById(teamId);
    const user = await userModel.findById(memberId);

    if (!team) throw new Error("Team not found.");
    if (!user) throw new Error("User not found.");

    // Ensure the member is actually in the team
    if (!team.members.includes(memberId)) {
      throw new Error("User is not a member of this team.");
    }

    // Remove the member from the team
    team.members = team.members.filter((member) => !member.equals(memberId));
    await team.save();

    // Update user to reflect that they are no longer in the team
    user.team = null;
    await user.save();

    return team;
  } catch (error) {
    throw new Error(`Failed to remove member: ${error.message}`); // Improved error message
  }
};

// Service for a user to leave the team
export const leaveTeam = async (teamId, userId) => {
  try {
    const team = await teamModel.findById(teamId);
    const user = await userModel.findById(userId);

    if (!team) throw new Error("Team not found.");
    if (!user) throw new Error("User not found.");

    // Ensure the user is a member of the team
    if (!team.members.includes(userId)) {
      throw new Error("User is not a member of this team.");
    }

    // Remove the user from the team
    team.members = team.members.filter((member) => !member.equals(userId));
    await team.save();

    // Update the user to reflect that they left the team
    user.team = null;
    await user.save();

    return team;
  } catch (error) {
    throw new Error(`Failed to leave team: ${error.message}`); // Improved error message
  }
};

// Service to get team members
export const getTeamMembers = async (teamId) => {
  try {
    const team = await teamModel.findById(teamId).populate("members");
    if (!team) throw new Error("Team not found.");

    const data = team.members.filter((member) => {
      member.password = undefined;
      return member;
    });

    return data;

  } catch (error) {
    throw new Error(`Failed to fetch team members: ${error.message}`);
  }
};

export const getAllTeams = async () => {
  try {
    const teams = await teamModel.find();
    return teams;
  } catch (error) {
    throw new Error(`Failed to fetch teams: ${error.message}`);
  }
}