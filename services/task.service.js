import userModel from "../models/user.model.js";

export const completeTask = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    return { user: null, error: 'User not found' };
  }

  const taskPoints = 200;
  user.points = (user.points || 0) + taskPoints;
  await user.save();

  return { user, error: null };
};

export const getLeaderboard = async () => {
  const users = await userModel.find({}, 'username points')
    .sort({ points: -1 })
    .limit(10);

  return users.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    points: user.points,
  }));
};
