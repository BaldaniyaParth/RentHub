const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define the schema for the User model
const userSchema = new Schema({
    email: {
        type: String,
        required: true, 
    }, 
});

// Apply the passportLocalMongoose plugin to the user schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
