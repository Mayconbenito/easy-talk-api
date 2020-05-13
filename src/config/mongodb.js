import mongoose from "mongoose";
import "dotenv/config";

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

export default mongoose;
