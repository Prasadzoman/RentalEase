
const Listing = require('../models/listing');
const listingSchema=require("../models/listing");
const ExpressError=require("../utils/ExpressError")
const path = require("path");
const PropertyCategory=require("../models/propertyCategory");

module.exports.index=async (req, res) => {
    const listings = await Listing.find({});
    res.render('listings/index', { listings });
}

module.exports.RenderNewForm=(req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate:{path:"author"}}).populate('owner');
    if(!listing){
        req.flash("error","Listing does not exists");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListings=async (req, res, next) => {
        console.log(req.body);
        const image={url:req.file.path,filename:req.file.filename};
        console.log(image);
        const category=req.body.categories;
        if(!category){
            category=[];
        }
        let { title, description, price, country, location } = req.body;
        if (!title || !description || !image || !price || !location || !country) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }
        const newList = new Listing({
            "title": title,
            "description": description,
            "image": image,
            "price": price,
            "location": location,
            "country": country,
            "category": category,
        })
        newList.owner=req.user._id; 
        await newList.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings")

}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    let og_image_url=listing.image.url;
    og_image_url=og_image_url.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs", { listing,og_image_url});
}

module.exports.updateListings = async (req, res) => {
    let { id } = req.params;
   
    
    const updateData = {
        ...req.body.listing,
        category: req.body.category || [] 
    };
    if (!Array.isArray(updateData.category)) {
        updateData.category = [updateData.category];
    }
    if (req.file) {
        updateData.image = { url: req.file.path, filename: req.file.filename };
    }
    await Listing.findByIdAndUpdate(id, updateData);
    req.flash("success", "Listing successfully updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListings=async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findByIdAndDelete(id);
    console.log(list);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}

module.exports.filterListings=async (req, res) => {
    const { category } = req.query;

    if (!category) {
        req.flash("error", "No category specified");
        return res.redirect("/listings");
    }

    const validCategories = Object.values(PropertyCategory);
    if (!validCategories.includes(category)) {
        req.flash("error", "Category does not exist");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({ category: { $in: [category] } });
    res.render("listings", { listings });
}

module.exports.searchListings=async(req,res)=>{
    let {title}=req.query;
    if(title){
        const listings=await Listing.find({title: { $regex: title, $options: 'i' }});
        if(listings.length===0){
            req.flash("error","No listings found");
            return res.redirect("/listings");
        }
        else{
            return res.render("listings",{listings});
        }
    }
    else{
        req.flash("error","Please enter a search term");
        return res.redirect("/listings");
    }
}