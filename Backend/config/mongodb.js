import mongoose from "mongoose";

const connectdb = () => {
  try {
    const connect = mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB is connected successfully!");
  } catch (error) {
    console.log("MongoDb is not connected", error.message);
  }
};

export default connectdb;