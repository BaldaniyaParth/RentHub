const mongoose = require("mongoose");

// Connecting to the MongoDB database

const dburl = process.env.ATLASDB_URL; 

mongoose
  .connect(dburl) 
  .then(() => {
    console.log("MongoDB connection successfully...");
  })
  .catch((err) => {
    console.log(err);
  });



