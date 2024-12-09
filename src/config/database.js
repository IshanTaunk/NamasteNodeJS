const mongoose = require("mongoose");

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://admin:cKmwVhHwwcfboBGs@cluster0.rhoaz9k.mongodb.net/devTinder"
    );
}

module.exports = connectDB;

