const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isReviewAuthor}=require("../middleware")
const reviewController=require("../controller/reviews")
//create review route
router.post("/",isLoggedIn,wrapAsync(reviewController.createReview))

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router