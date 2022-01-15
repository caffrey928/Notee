import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  todo: {
    type: [mongoose.Types.ObjectId],
    ref: "Todo",
  },
  activity: {
    type: [mongoose.Types.ObjectId],
    ref: "Activity",
  },
});

const TodoSchema = new Schema({
  title: {
    type: String,
    required: [true, "Todo name is required."],
  },
  dueTime: {
    type: Date,
    required: true,
  },
  activity: {
    type: String,
  },
  description: {
    type: String,
    required: false,
  },
  priority: {
    type: Number,
    required: true,
  },
});

const ActivitySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  progress: {
    type: [mongoose.Types.ObjectId],
    ref: "Progress",
    required: false,
  },
  users: {
    type: [String],
    required: true,
  },
  todo: {
    type: [mongoose.Types.ObjectId],
    ref: "Todo",
    required: false,
  },
});

const ProgressSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  dueTime: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model("user", UserSchema);
const Todo = mongoose.model("todo", TodoSchema);
const Activity = mongoose.model("activity", ActivitySchema);
const Progress = mongoose.model("progress", ProgressSchema);

export { User, Todo, Activity, Progress };
