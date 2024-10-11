import bcrypt from 'bcrypt';
import userModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import { getUserPosts } from './post.service.js';
import challengeModel from '../models/challenge.model.js';

export const getUserById = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return null;
        }

        const { password, ...data } = user._doc;
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userId, updateData) => {
    if (updateData.password) {
        try {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        } catch (error) {
            throw error;
        }
    }

    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return null;
        }

        const { password, ...data } = user._doc;
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        await userModel.findByIdAndDelete(userId);
    } catch (error) {
        throw error;
    }
};



export const followUser = async (currentUserData, targetUserData) => {
    if (currentUserData.userId === targetUserData.id) {
        throw new Error("You can't follow yourself");
    }

    try {
        const currentUser = await userModel.findById(currentUserData.userId);
        const targetUser = await userModel.findById(targetUserData.id);

        if (!currentUser || !targetUser) {
            throw new Error("One of the users does not exist");
        }

        if (!targetUser.followers.includes(currentUserData.userId)) {
            await targetUser.updateOne({ $push: { followers: currentUserData.userId } });
            await currentUser.updateOne({ $push: { followings: targetUserData.id } });

            const updatedTargetUser = await userModel.findById(targetUserData.id);
            const updatedCurrentUser = await userModel.findById(currentUserData.userId);
            return { updatedCurrentUser, updatedTargetUser };

        } else {
            throw new Error("Already following this user");
        }

    } catch (error) {
        throw new Error(`Failed to follow user: ${error.message}`);
    }
}

export const unfollowUser = async (currentUserData, targetUserData) => {
    if (currentUserData.userId === targetUserData.id) {
        throw new Error("You can't unfollow yourself");
    }

    try {
        const currentUser = await userModel.findById(currentUserData.userId);
        const targetUser = await userModel.findById(targetUserData.id);

        if (!currentUser || !targetUser) {
            throw new Error("One of the users does not exist");
        }

        if (targetUser.followers.includes(currentUserData.userId)) {
            await targetUser.updateOne({ $pull: { followers: currentUserData.userId } });
            await currentUser.updateOne({ $pull: { followings: targetUserData.id } });

            const updatedTargetUser = await userModel.findById(targetUserData.id);
            const updatedCurrentUser = await userModel.findById(currentUserData.userId);
            return { updatedCurrentUser, updatedTargetUser };

        } else {
            throw new Error("You are not following this user");
        }

    } catch (error) {
        throw new Error(`Failed to unfollow user: ${error.message}`);
    }
}



export const updateProfilePicture = async (userId, fileUrl) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { profilePicture: fileUrl } },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    } catch (error) {
        next(error);
    }
};



export const getFullUser = async (userId) => {
    try {
        const user = await userModel.findById(userId).populate('completedChallenges');
        if (!user) {
            return null;
        }
        const { password, completedChallenges, ...data } = user._doc;

        const userPosts = await getUserPosts(userId);

        return {
            ...data,
            posts: userPosts,
        };
    } catch (error) {
        next(error)
    }
};
