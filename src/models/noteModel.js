import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, "ID is required!"],
  },
  title: {
    type: String
  },
  content: {
    type: String,
    required: [true, "Content is required!"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
}, { timestamps: true });

const Note = mongoose.models.notes || mongoose.model("notes", notesSchema);

export default Note;