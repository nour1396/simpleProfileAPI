const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    email: String,
    password: String/* ,
    userImg: String */
});

const User = mongoose.model('users', userSchema);
exports.User = User