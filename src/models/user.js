const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Not a strong password: "+ value);
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["M","F","Others"].includes(value)){
                throw new Error("Gender data is not valid!");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Not a valid URL: "+ value);
            }
        }
    },
    about: {
        type: String,
        default: "This is default about of the user."
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("User",userSchema);