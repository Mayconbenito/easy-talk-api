import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

export default mongoose;
