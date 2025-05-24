const Listing=require("./models/listing");
const Review=require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectURL = req.originalUrl; 
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL; 
    }
    next(); 
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner"); 

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!listing.owner || !req.user || !listing.owner._id.equals(req.user._id)) {  
        req.flash("error", "You don't have permission to edit this listing.");
        return res.redirect(`/listings/${id}`);
    }
    
    next(); 
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!review.author || !req.user || !review.author._id.equals(req.user._id)) {  
        req.flash("error", "You don't have permission to delete this review.");
        return res.redirect(`/listings/${id}`);
    }
    
    next(); 
};
