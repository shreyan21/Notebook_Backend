import mongoose, { Schema } from "mongoose";
const NotesSchema = new Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    tag: { type: String, default: "General" },
    date: { type: Date, default: Date.now }

})

export default mongoose.model('Notes', NotesSchema)
