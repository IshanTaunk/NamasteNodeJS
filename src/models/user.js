const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
});

userSchema.methods.getJWT = async function(){
    const user = this;
    //create jwt
    const token = await jwt.sign({_id:user._id},"Dev4Tinder@",{expiresIn:"1d"});

    return token;
}

userSchema.methods.comparePwd = async function(inputPwd){
    const user = this;
    //create jwt
    const isPasswordValid = await bcrypt.compare(inputPwd, user.password);

    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);