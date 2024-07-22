if(process.env.NODE_ENV  != "production"){
  require('dotenv').config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.model.js");

const dburl = process.env.ATLASDB_URL; 

mongoose
  .connect(dburl) 
  .then(() => {
    console.log("MongoDB connection successfully...");
  })
  .catch((err) => {
    console.log(err);
  });


const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner:"669dfcafe1d0498e92fc6b74"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
