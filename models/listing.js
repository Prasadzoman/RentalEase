const mongoose=require('mongoose');
const review = require('./review');
const schema=mongoose.Schema;
const Review=require("./review");
const PropertyCategory=require("./propertyCategory");


const listingSchema=new schema({
    title:{ type:String, required:true},
    description:String,
    image: {
        filename: { type: String, required: true },
        url: { type: String, required: true },
      },
    price:String,
    location:String,
    country:String,
    reviews:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
      }
    ],
    owner:{
      type:schema.Types.ObjectId,
      ref:"User",
    },
    
    category:[{
      type:String,
      enum: Object.values(PropertyCategory),
      required:true,
    }]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  }
});
const Listing=mongoose.model("Listing",listingSchema)
module.exports=Listing;
