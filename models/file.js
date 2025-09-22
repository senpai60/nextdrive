// models/file.js
const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    filename: { type: String, required: true, default: 'NewFile' },
    url: { type: String, required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // added
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);
    