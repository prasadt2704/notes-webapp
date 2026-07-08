import mongoose from "mongoose";

const scriptSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "ID is required!"],
  },
  title: {
    type: String,
    required: [true, "Title is required!"],
  },
  hook: {
    type: String,
   default: "",
  },
  content: {
    type: String,
    required: [true, "Script content is required!"],
  },
  cta: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Idea", "Drafting", "Ready", "Shot", "Posted"],
    default: "Idea",
  },
  instagramLink: {
    type: String,
    default: "",
  },
  locations: [{
    type: String,
    default: "",
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
}, { timestamps: true });

const Script = mongoose.models.scripts || mongoose.model("scripts", scriptSchema);

export default Script;
