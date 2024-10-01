import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"


export const registerUser = async (body) => {
    try {
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = new userModel({
            username: body.username,
            email: body.email,
            password: hashedPassword
        });

        await newUser.save();

        return newUser;
    } catch (error) {
        console.error("Error during user registration:", error.message);
        throw new Error("User registration failed.");
    }
};




export const loginUser = async (body, res) => {
    try {
        const user = await userModel.findOne({ email: body.email });

        if (!user) {
            res.status(404).json({ message: "User Not Found" });
            return null
        }

        const passwordCheck = await bcrypt.compare(body.password, user.password);

        if (!passwordCheck) {
            res.status(400).json({ message: "Wrong Password" });
            return null
        }

        return user;
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error });
    }
};