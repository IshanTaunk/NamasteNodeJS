const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: '{VALUE} is incorrect status type'
            }
        }
    },
    {
        timestamps: true
    }
);

connectionRequestSchema.index({fromUserId:1, toUserId: 1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("Can't send request to yourself!");
    };
    next();
})


module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);