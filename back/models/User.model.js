const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// For Postamann tes 
// {"email":"Hottakes1@gmail.com","password":"Fuck666"}
// pardon pour la vulgarité
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);