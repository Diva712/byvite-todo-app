import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title for Task is required !"],
    },
    description: {
      type: String,
      required: [true, "Write some description about task !"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  }, {
  timestamps: true
}
);

export const Task = mongoose.model("Task", taskSchema)