const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.reviewadd = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        const review = new Review(req.body.review);
        await review.save();
        listing.reviews.push(review);
        await listing.save();
        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.reviewdel = async (req, res, next) => {
    try {
        await Listing.findByIdAndUpdate(req.params.id, {
            $pull: { reviews: req.params.reviewId },
        });
        await Review.findByIdAndDelete(req.params.reviewId);
        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
        next(err);
    }
};
