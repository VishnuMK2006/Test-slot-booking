import mongoose from "mongoose";

const loginLogSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
  },
  loginAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LoginLog", loginLogSchema);
