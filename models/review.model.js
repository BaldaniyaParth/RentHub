const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the Review model
const reviewSchema = new Schema({
    comment: String,
    
    rating: {
        type: Number,
        min: 1, 
        max: 5, 
    },
    
    createdAt: {
        type: Date,
        default: Date.now(), // Automatically sets to the current date and time
    },
    
    author: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
    },
});

module.exports = mongoose.model("Review", reviewSchema);
