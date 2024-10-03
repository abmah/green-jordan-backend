import { completeTask, getLeaderboard } from '../services/task.service.js';

export const doTaskController = async (req, res) => {
  try {
    const { user, error } = await completeTask(req.body.userId);
    if (error) {
      return res.status(404).json({ message: error });
    }

    return res.status(200).json({
      message: 'Task completed successfully',
      tasks: user.tasks,
      points: user.points,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

export const leaderboardController = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    return res.status(200).json({ leaderboard });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};
