import { getUserById, updateUser, deleteUser, unfollowUser, followUser } from "../services/user.service.js";

export const updateUserController = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.userId === userId || req.body.isAdmin) {
      const updatedUser = await updateUser(userId, req.body);
      const { password, ...data } = updatedUser;

      res.status(200).json({
        user: data,
        message: 'User Updated Successfully',
      });
    } else {
      return res.status(403).json({
        message: "You can update only your account!",
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteUserController = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.userId === userId || req.body.isAdmin) {
      await deleteUser(userId);
      res.status(200).json({
        message: 'Account has been deleted successfully',
      });
    } else {
      return res.status(403).json({
        message: "You can only delete your account or must be an admin to do this!",
      });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      message: "An error occurred while deleting the user",
    });
  }
};

export const getUserController = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user,
      message: 'User fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      message: 'An error occurred while fetching the user',
    });
  }
};


export const followUserController = async (req, res) => {
  try {

    const data = await followUser(req.body, req.params);


    res.status(200).json({
      message: 'User followed successfully',
      data
    });

  } catch (error) {
    res.status(500).json({ message: 'Error following user', error });

  }
};


export const unfollowUserController = async (req, res) => {
  try {

    const data = await unfollowUser(req.body, req.params);

    res.status(200).json({
      message: 'User unfollowed successfully',
      data
    });

  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error });

  }
};
