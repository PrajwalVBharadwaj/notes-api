const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    notes: [
        {
            _id: mongoose.Types.ObjectId,
            heading: String,
            content: String,
            background: String,
            font: String,
            imageUrl: String,
        },
    ],
});

module.exports = { userSchema };
