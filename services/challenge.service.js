import data from "../data/challenges.js";
import challengeModel from "../models/challenge.model.js";
import userModel from "../models/user.model.js";
import moment from "moment";

export const assignDailyChallengesService = async (userId) => {
  console.log(userId);

  const user = await userModel.findById(userId).populate("dailyChallengesAssigned");
  if (!user) throw new Error("User not found.");

  const today = moment().startOf("day");

  if (user.lastDailyAssignedAt && moment(user.lastDailyAssignedAt).isSame(today)) {
    return {
      message: "Daily challenges already assigned for today.",
      dailyChallenges: user.dailyChallengesAssigned.map((challenge) => {
        const isCompleted = user.completedChallenges.some((completed) => completed.challengeId.equals(challenge._id));
        return { ...challenge.toObject(), completed: isCompleted };
      }),
    };
  }

  const availableChallenges = await challengeModel.find({
    _id: { $nin: user.completedChallenges.map((c) => c.challengeId) },
    isDaily: true,
  }).limit(2);

  if (availableChallenges.length < 2) throw new Error("Not enough daily challenges available.");

  user.dailyChallengesAssigned = availableChallenges.map((challenge) => challenge._id);
  user.lastDailyAssignedAt = today;
  await user.save();

  const challengesWithCompletionStatus = availableChallenges.map((challenge) => {
    const isCompleted = user.completedChallenges.some((completed) => completed.challengeId.equals(challenge._id));
    return { ...challenge.toObject(), completed: isCompleted };
  });

  return {
    message: "Two daily challenges assigned.",
    dailyChallenges: challengesWithCompletionStatus,
  };
};

export const getAvailableFreeChallengesService = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found.");

  const last24Hours = moment().subtract(24, "hours");
  const recentFreeChallenges = user.completedChallenges
    .filter((c) => c.completedAt >= last24Hours && c.isFree)
    .map((c) => c.challengeId);

  const availableFreeChallenges = await challengeModel.find({
    _id: { $nin: recentFreeChallenges },
    isFree: true,
  }).limit(2);

  return {
    message: "Free challenges fetched successfully.",
    freeChallenges: availableFreeChallenges,
  };
};

export const completeChallengeService = async (userId, challengeId) => {
  if (!userId || !challengeId) throw new Error("User ID and Challenge ID are required.");

  const user = await userModel.findById(userId).populate("dailyChallengesAssigned");
  if (!user) throw new Error("User not found.");

  const challengeCompleted = user.completedChallenges.some((c) => c.challengeId.equals(challengeId));
  if (challengeCompleted) throw new Error("Challenge has already been completed by the user.");

  const assignedChallenge = user.dailyChallengesAssigned.find((c) => c._id.equals(challengeId));
  if (!assignedChallenge) throw new Error("Challenge is not part of the assigned daily challenges.");

  const pointsEarned = await updateUserPoints(userId, assignedChallenge.points, true);
  const streakUpdated = await checkAndUpdateStreak(userId);

  user.completedChallenges.push({
    challengeId: assignedChallenge._id,
    completedAt: new Date(),
    isFree: assignedChallenge.isFree,
  });

  await user.save();

  return {
    message: "Challenge completed successfully.",
    pointsEarned,
    streakUpdated,
  };
};

export const updateUserPoints = async (userId, points, isMainChallenge) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");

  const streakBonus = isMainChallenge && user.streak >= 5 ? 1.5 : 1;
  const pointsToAdd = points * streakBonus;

  user.points += pointsToAdd;
  user.allTimePoints += pointsToAdd;

  await user.save();
  return pointsToAdd;
};

export const checkAndUpdateStreak = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");

  const lastChallengeCompleted = new Date(user.lastChallengeCompleted);
  const currentDate = new Date();
  const sameDay = lastChallengeCompleted.toDateString() === currentDate.toDateString();

  if (!sameDay) {
    const diffInTime = currentDate - lastChallengeCompleted;
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    if (diffInDays > 1) {
      user.streak = 1;
    } else {
      user.streak += 1;
    }
  }

  user.lastChallengeCompleted = currentDate;
  await user.save();
  return user.streak;
};

export const createChallengeService = async (challengeData) => {
  const { title, description, points } = challengeData;

  if (!title || !description || !points) throw new Error("Title, description, and points are required.");

  const challenge = new challengeModel(challengeData);
  await challenge.save();

  return { message: "Challenge created successfully.", challenge };
};

export const updateChallengeService = async (id, challengeData) => {
  if (!id) throw new Error("Challenge ID is required.");

  const updatedChallenge = await challengeModel.findByIdAndUpdate(id, challengeData, { new: true });
  if (!updatedChallenge) throw new Error("Challenge not found.");

  return { message: "Challenge updated successfully.", updatedChallenge };
};

export const deleteChallengeService = async (id) => {
  if (!id) throw new Error("Challenge ID is required.");

  const deletedChallenge = await challengeModel.findByIdAndDelete(id);
  if (!deletedChallenge) throw new Error("Challenge not found.");

  return { message: "Challenge deleted successfully." };
};

export const populateChallengesFromFileService = async () => {
  const challenges = data;
  await challengeModel.deleteMany({});

  for (const challenge of challenges) {
    const newChallenge = new challengeModel(challenge);
    await newChallenge.save();
  }

  return { message: "Challenges populated successfully." };
};

export const getLeaderboardService = async () => {
  const leaderboard = await userModel
    .find({})
    .sort({ allTimePoints: -1 })
    .limit(10)
    .select("username allTimePoints profilePicture");

  return {
    message: "Leaderboard fetched successfully",
    leaderboard,
  };
};
