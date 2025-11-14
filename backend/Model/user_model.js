const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
        unique: true,
    },
    role:{
        type: String,
        enum : [Farmer , Expert],
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

const User = new mongoose.model("User",user_schema);

module.exports = User;