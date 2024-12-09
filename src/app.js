const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async(req,res) => {

    const user = new User({
        firstName: "virat",
        lastName: "kohli",
        email: "ishan.taunk444@gmail.com",
        password: "password",
        age: 30,
        gender: "M"
    })

    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.send("Error creating User: "+ err.message);
    }
})

connectDB()
    .then(()=>{
        console.log("db connection made");
        app.listen(3000,()=>{
            console.log("Server is listening");
        });
    }).catch(err=>{
        console.log("db connection not made");
    });