const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.model");

// Define the schema for the Listing model
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },

  description: String,

  image: {
    url: String,
    filename: String,
  },

  price: Number,

  location: String,

  country: String,

  // Array of review IDs referencing the Review model
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    },
  ],

  // Owner ID referencing the User model
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  // GeoJSON schema for location with type and coordinates
  geometry: {
    type: {
      type: String, // Type of the geometry, must be 'Point'
      enum: ['Point'], // 'type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers representing coordinates [longitude, latitude]
      required: true,
    },
  },
  
  category: Number,
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

