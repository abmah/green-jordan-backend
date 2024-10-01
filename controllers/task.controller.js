
import userModel from "../models/user.model.js"








export const doTaskController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    console.log(req)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hardcode task points as 300 and add to the user's points
    const taskPoints = 200;
    user.points = (user.points || 0) + taskPoints;  // Ensure points is initialized if undefined
    user.tasks = (user.tasks || 0) + 1;             // Increment the tasks field by 1

    await user.save();  // Save the updated user document

    return res.status(200).json({
      message: 'Task completed successfully',
      tasks: user.tasks,
      points: user.points
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};


export const leaderboardController = async (req, res) => {
  try {
    // Fetch top 10 users sorted by points in descending order
    const users = await userModel.find({}, 'username points') // Only return username and points
      .sort({ points: -1 })         // Sort by points in descending order
      .limit(10);                   // Limit to top 10 users

    // Map the users to add rank
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,            // Assign rank based on position in the sorted array
      username: user.username,    // Return the username
      points: user.points         // Return the points
    }));

    return res.status(200).json({ leaderboard });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};
