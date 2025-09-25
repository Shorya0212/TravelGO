const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
};

module.exports.new = (req, res) => {
  res.render("listings/new");  
};

module.exports.create = async (req, res, next) => {
  try {
    const { listing } = req.body;
    
    console.log("Incoming form data:", listing);

    if (
      !listing ||
      !listing.title ||
      !listing.description ||
      !listing.price ||
      !listing.location ||
      !listing.country ||
      !listing.image ||
      !listing.image.url
    ) {
      req.flash("error", "All fields including image URL are required.");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing(listing);
    await newListing.save();

    req.flash("success", "Successfully created a new listing!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.show = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.edit = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.update = async (req, res, next) => {
  try {
    const { listing } = req.body;

    console.log("Update form data:", listing);

    if (
      !listing ||
      !listing.title ||
      !listing.description ||
      !listing.price ||
      !listing.location ||
      !listing.country ||
      !listing.image ||
      !listing.image.url
    ) {
      req.flash("error", "All fields including image URL are required.");
      return res.redirect(`/listings/${req.params.id}/edit`);
    }

    await Listing.findByIdAndUpdate(req.params.id, listing);

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
