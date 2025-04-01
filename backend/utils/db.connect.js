import mongoose from "mongoose";

export const Connectdb = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.DB_URL);
    console.log(`Db connected to ${connectionInstance.connection.name}`);
  } catch (error) {
    console.error("Error connecting to DB", error.message);
    process.exit(1);
  }
};
