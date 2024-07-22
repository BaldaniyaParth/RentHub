const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); 
const { isLoggedIn, isOwner, validateListing } = require("../middlewares/middleware.js");
const listingController = require("../controllers/listings.controller.js");
const multer = require('multer');
const { storage } = require("../utils/cloudConfig.js"); 
const upload = multer({ storage }); 

// Route for filtering listings by ID
router.get("/filter/:id", wrapAsync(listingController.filter));

// Route for searching listings
router.get("/search", wrapAsync(listingController.search));

// Routes for listing operations
router.route("/")
    .get(wrapAsync(listingController.index)) 
    .post(
        isLoggedIn, 
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingController.createListings) 
    );

// Route for displaying the form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Routes for specific listing operations
router.route("/:id")
    .get(wrapAsync(listingController.showListing)) 
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single("listing[image]"), 
        validateListing, 
        wrapAsync(listingController.updateListing) 
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing)
    );

// Route for displaying the form to edit an existing listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
