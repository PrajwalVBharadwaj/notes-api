const mongoose = require("mongoose");
const Schema = require("./schema");

const userModel = mongoose.model("users", Schema.userSchema);

module.exports = { userModel };
