const mongoose=require('mongoose');
const initdata=require('./data');
const Listing=require('../models/listing.js');


const url=`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.26ryt5e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

async function main() {
    try {
        await mongoose.connect(url);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj) => ({...obj, owner:"67d6d3509c0ea42c56e6b1e5"}))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

main().then(initDB);