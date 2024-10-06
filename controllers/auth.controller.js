
import { registerUser, loginUser } from "../services/auth.service.js"


export const register = async (req, res) => {
  try {

    const newUser = await registerUser(req.body)

    if (!newUser) {
      res.status(400).json({
        message: 'Error Ocurred Registering User'
      })
      return
    }
    const { password, ...data } = newUser._doc

    res.status(200).json({
      data,
      message: 'User Registered'
    })

  } catch (error) {
    res.status(500).json({
      error: error,
      message: 'Error Ocurred Registering User'
    })
  }

}


export const login = async (req, res) => {
  try {
    const loggedInUser = await loginUser(req.body, res);

    if (!loggedInUser) return;

    const { password, ...data } = loggedInUser._doc;

    res.status(200).json({
      message: 'User Logged In',
      data,
    });
  } catch (error) {

    res.status(500).json({
      message: 'Error Occurred Logging In User',
      error
    });
  }
};

