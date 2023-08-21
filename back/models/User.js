const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
      },
    password: {
        type: String,
        required: true
      },
})

const User = mongoose.model('User', userSchema);
module.exports = User;

// The user's password must be hashed.
// ● Authentication must be enforced on all required sauce routes.
// ● Email addresses in the database are unique and one
// appropriate Mongoose plugin is used to ensure their uniqueness and report
// Errors.
// ● MongoDB database security (from a service such as
// MongoDB Atlas) should not prevent the application from launching on the
// a user's machine.
// ● A Mongoose plugin must ensure the reporting of errors from the database
// of data.
// ● Latest versions of software are used with patches
// updated security.
// ● The contents of the images folder should not be uploaded to GitHub.