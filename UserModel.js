const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    confirmpassword: {
        type: String,
        required: true,
        unique: false,
    }
},
    { timestamps: true },
    { versionKey: false }
);

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;
