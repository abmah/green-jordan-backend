import { getUserById, updateUsername, deleteUser, unfollowUser, followUser, updateProfilePicture, getFullUser } from "../services/user.service.js";

// controllers/user.controller.js
// controllers/user.controller.js
export const updateUsernameController = async (req, res) => {
  const userId = req.params.id;
  const { username } = req.body;  // Get new username from the request body

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the request is from the user themselves or an admin
    if (req.body.userId === userId || req.body.isAdmin) {
      const updateResponse = await updateUsername(userId, username);  // Call the updated function

      // Check if the response indicates the username is the same
      if (updateResponse.message) {
        return res.status(400).json(updateResponse);  // Return the message if no update occurred
      }

      res.status(200).json({
        user: updateResponse,
        message: 'Username updated successfully',
      });
    } else {
      return res.status(403).json({
        message: "You can only update your own account!",
      });
    }
  } catch (error) {
    console.error('Error updating username:', error);
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



export const updateProfilePictureController = async (req, res) => {
  try {
    const userId = req.params.id;

    const fileUrl = req.file?.path || req.file?.secure_url;
    if (!fileUrl) {
      return res.status(400).json({
        message: "Image upload failed",
      });
    }


    const updatedUser = await updateProfilePicture(userId, fileUrl);

    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
    // res.status(500).json({
    //   message: "Error updating profile picture",
    //   error: error.message,
    // });
  }
};



export const getFullUserController = async (req, res) => {
  try {

    const userId = req.params.id;

    const data = await getFullUser(userId);

    res.status(200).json({
      message: 'User fetched successfully',
      data
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });

  }
};

