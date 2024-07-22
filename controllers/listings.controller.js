const Listing = require("../models/listing.model");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN; // Mapbox token from environment variables
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); // Initialize Mapbox Geocoding client

// Get all listings and render the index page
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); 
    res.render("listings/index.ejs", { allListings }); 
};

// Render the form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs"); 
};

// Show details of a single listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params; 
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner"); 
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings"); 
    }
    res.render("listings/show.ejs", { listing, mapToken }); 
};

// Create a new listing and save it to the database
module.exports.createListings = async (req, res) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: `${req.body.listing.location},${req.body.listing.country}`,
            limit: 1,
        })
        .send(); // Get geocoding data

    let url = req.file.path; 
    let filename = req.file.filename; 
    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id; 
    newListing.image = { url, filename }; 
    newListing.geometry = response.body.features[0].geometry; 
    await newListing.save(); 
    req.flash("success", "New Listing Created!");
    res.redirect("/listings"); 
};

// Render the form to edit an existing listing
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params; 
    const listing = await Listing.findById(id); 
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings"); 
    }

    let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250"); 
    res.render("listings/edit.ejs", { listing, originalImageUrl }); 
};

// Update an existing listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params; 
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true }); 
    if (req.file) {
        let url = req.file.path; 
        let filename = req.file.filename; 
        listing.image = { url, filename }; 
        await listing.save(); 
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`); 
};

// Delete an existing listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params; 
    await Listing.findByIdAndDelete(id); 
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings"); 
};

// Filter listings based on category
module.exports.filter = async (req, res) => {
    let { id } = req.params; 
    let allListings = await Listing.find({ category: id }); 
    if (allListings.length > 0) {
        res.render("listings/index.ejs", { allListings }); 
    } else {
        req.flash("error", "No listings found for this category");
        res.redirect("/listings"); 
    }
};

// Search for listings based on title
module.exports.search = async (req, res) => {
    let { title } = req.query; 
    const allListings = await Listing.find({ title: new RegExp(title, 'i') }); 
    res.render("listings/index.ejs", { allListings }); 
};
