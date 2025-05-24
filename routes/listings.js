const express=require("express");
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync")
const Listing = require("../models/listing");
const {isLoggedIn, isOwner}=require("../middleware");
const ListingController=require("../controller/listings");
const multer  = require('multer')
const {storage,cloudinary}=require("../cloudConfig")


const upload = multer({ storage })

//index route and create route
router
.route('/')
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,upload.single('image'),wrapAsync(ListingController.createListings))


//new route
router.get('/new',isLoggedIn,ListingController.RenderNewForm)

//filter route
router.get('/filter', wrapAsync(ListingController.filterListings));

//search route
router.get('/search',wrapAsync(ListingController.searchListings))
//show route, update route and distroy route
router
.route('/:id')
.get(wrapAsync(ListingController.showListing))
.put(isLoggedIn,isOwner, upload.single("listing[image]"),wrapAsync(ListingController.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.deleteListings))

//render edit route
router.get('/:id/edit',isOwner,wrapAsync(ListingController.renderEditForm));

module.exports=router;