import mongoose from "mongoose";



export const dbConnect = () => {
  try {
    mongoose.connect(process.env.DB_URL)
    console.log("db connected")
  } catch (error) {
    throw error
  }


}